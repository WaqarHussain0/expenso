/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { UserRoleEnum } from '../user/entities/user.entity';
import { OAuth2Client } from 'google-auth-library';

const userService = new UserService();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  generateToken(user: any) {
    // Prepare payload for JWT
    const jwtPayload = {
      id: user._id || '',
      email: user.email || '',
      role: user.role || '',
    };

    // Get JWT secret from env
    const JWT_SECRET =
      process.env.NEXT_PUBLIC_JWT_SECRET || 'your_super_secret';
    const JWT_EXPIRY_HOURS = Number(
      process.env.NEXT_PUBLIC_JWT_EXPIRY_HOURS || '1',
    );

    // Convert hours to seconds
    const expiresInSeconds = JWT_EXPIRY_HOURS * 60 * 60;

    return jwt.sign(jwtPayload, JWT_SECRET, {
      expiresIn: expiresInSeconds,
    });
  }

  async login(payload: LoginDto) {
    const { email, password } = payload;

    const user = await userService.findByEmail(email);

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = await this.generateToken(user);

    // Return only necessary user details + token
    const userData = {
      id: user._id || '',
      name: user.name,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
    };

    return { user: userData, accessToken: token };
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
    // const { email, name, picture } = payload;

    let user = await userService.findByEmail(email!);

    if (!user) {
      user = await userService.createUser({
        email: email || '',
        name: name || '',
        role: UserRoleEnum.USER,
        password: '',
      });
    }

    const accessToken = this.generateToken(user);

    // Return only necessary user details + token
    const userData = {
      id: user._id || '',
      name: user.name,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
    };

    return { userData, accessToken };
  }
}
