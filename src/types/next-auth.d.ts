import 'next-auth';
import { IUser } from './user.type';

declare module 'next-auth' {
  interface Session {
    user: IUser;
    accessToken?: string;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    id: string;
    role: string;
    name: string;
    email: string;
    accessToken?: string;
  }
}
