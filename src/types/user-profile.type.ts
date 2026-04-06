export enum UserGenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface IUserProfile {
  _id: string;
  contact?: string;
  gender?: UserGenderEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
