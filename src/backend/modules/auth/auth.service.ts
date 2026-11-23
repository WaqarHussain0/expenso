/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import {
  LoginMethodEnum,
  UserRoleEnum,
} from '../user/entities/user.entity';
import { OAuth2Client } from 'google-auth-library';
import { initDB } from '@/backend/utils/dbInit.util';
import RefreshTokenEntity from './entities/refresh-token.entity';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_REUSE_GRACE_MS,
  REFRESH_TOKEN_TTL_SECONDS,
  getJwtSecret,
} from './auth.config';

const userService = new UserService();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface IAuthTokens {
  accessToken: string;
  /** epoch ms */
  accessTokenExpires: number;
  refreshToken: string;
  /** epoch ms */
  refreshTokenExpires: number;
}

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export class AuthService {
  /** Short-lived signed JWT used as the Bearer token for API calls. */
  generateToken(user: any) {
    const jwtPayload = {
      id: user._id?.toString?.() || user.id || '',
      email: user.email || '',
      role: user.role || '',
    };

    return jwt.sign(jwtPayload, getJwtSecret(), {
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    });
  }

  /** Issue a new access token + refresh token pair for a user. */
  async issueTokens(user: any): Promise<IAuthTokens> {
    await initDB();

    const now = Date.now();
    const refreshToken = crypto.randomBytes(48).toString('base64url');
    const refreshTokenExpires = now + REFRESH_TOKEN_TTL_SECONDS * 1000;

    await RefreshTokenEntity.create({
      userId: new mongoose.Types.ObjectId(String(user._id ?? user.id)),
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(refreshTokenExpires),
    });

    return {
      accessToken: this.generateToken(user),
      accessTokenExpires: now + ACCESS_TOKEN_TTL_SECONDS * 1000,
      refreshToken,
      refreshTokenExpires,
    };
  }

  /**
   * Exchange a refresh token for a fresh token pair (rotation).
   *
   * - The presented token is revoked and replaced.
   * - A token rotated less than REFRESH_TOKEN_REUSE_GRACE_MS ago is still
   *   accepted (parallel requests racing the rotation).
   * - Re-use of an older revoked token is treated as theft: every refresh
   *   token for that user is revoked, forcing a fresh sign-in everywhere.
   */
  async refreshTokens(refreshToken: string) {
    await initDB();

    if (!refreshToken) throw new Error('Refresh token missing');

    const now = new Date();
    const tokenHash = hashToken(refreshToken);

    // Atomically claim the token so two concurrent refreshes can't both rotate it
    let record = await RefreshTokenEntity.findOneAndUpdate(
      { tokenHash, revokedAt: null, expiresAt: { $gt: now } },
      { $set: { revokedAt: now } },
      { returnDocument: 'before' },
    ).lean();

    if (!record) {
      const existing = await RefreshTokenEntity.findOne({ tokenHash }).lean();

      if (!existing || existing.expiresAt <= now) {
        throw new Error('Refresh token expired or invalid');
      }

      const revokedAgo = existing.revokedAt
        ? now.getTime() - new Date(existing.revokedAt).getTime()
        : Infinity;

      if (revokedAgo > REFRESH_TOKEN_REUSE_GRACE_MS) {
        // Reuse of a long-rotated token → assume it was stolen
        await this.revokeAllForUser(existing.userId);
        throw new Error('Refresh token reuse detected');
      }

      record = existing; // within grace window: allow
    }

    const user = await userService.findById(record.userId).catch(() => null);
    if (!user || user.isActive === false) {
      await this.revokeAllForUser(record.userId);
      throw new Error('User not found or inactive');
    }

    const tokens = await this.issueTokens(user);

    // Best-effort: activity tracking must never break a refresh
    await userService.recordActivity(user._id).catch(() => undefined);

    await RefreshTokenEntity.updateOne(
      { _id: record._id, replacedByHash: null },
      { $set: { replacedByHash: hashToken(tokens.refreshToken) } },
    );

    return {
      tokens,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /** Revoke a single refresh token (logout). Silently ignores unknown tokens. */
  async revokeRefreshToken(refreshToken?: string | null) {
    if (!refreshToken) return;
    await initDB();
    await RefreshTokenEntity.updateOne(
      { tokenHash: hashToken(refreshToken), revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }

  /** Revoke every active refresh token for a user (logout everywhere). */
  async revokeAllForUser(userId: mongoose.Types.ObjectId | string) {
    await initDB();
    await RefreshTokenEntity.updateMany(
      { userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }

  async login(payload: LoginDto) {
    const { email, password } = payload;

    const user = await userService.findByEmail(email);

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    if (user && !user.isActive) {
      throw new Error(
        'User account is inactive, please contact admin to activate your account',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const tokens = await this.issueTokens(user);
    await userService
      .recordLogin(user._id, LoginMethodEnum.PASSWORD)
      .catch(() => undefined);

    // Return only necessary user details + tokens
    const userData = {
      id: user._id || '',
      name: user.name,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
    };

    return { user: userData, ...tokens };
  }

  async signup(payload: RegisterDto) {
    return await userService.createUser(payload);
  }

  async forgotPassword(email: string) {
    return await userService.forgotPassword(email);
  }

  async resetPasswordByToken(token: string, password: string) {
    return await userService.resetPasswordByToken(token, password);
  }

  async googleLogin(googleToken: string) {
    // ✅ VERIFY TOKEN WITH GOOGLE
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid Google token');
    }

    const { email, name } = payload;

    let user = await userService.findByEmail(email!);

    if (!user) {
      user = await userService.createUser({
        email: email || '',
        name: name || '',
        role: UserRoleEnum.USER,
        password: '',
      });
    }

    if (user && user.isActive === false) {
      throw new Error(
        'User account is inactive, please contact admin to activate your account',
      );
    }

    const tokens = await this.issueTokens(user);
    await userService
      .recordLogin(user._id, LoginMethodEnum.GOOGLE)
      .catch(() => undefined);

    // Return only necessary user details + tokens
    const userData = {
      id: user._id || '',
      name: user.name,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
    };

    return { userData, ...tokens };
  }
}
