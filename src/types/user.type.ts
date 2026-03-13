export interface IUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}
