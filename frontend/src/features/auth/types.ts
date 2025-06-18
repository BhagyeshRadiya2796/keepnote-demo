export interface IUser {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface ISignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
