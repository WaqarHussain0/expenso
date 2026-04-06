import { IUserProfile } from "./user-profile.type";

export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}
export interface IUser {
  id: string;
  name: string;
  role: UserRoleEnum;
  email: string;
  profile?: IUserProfile;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}
