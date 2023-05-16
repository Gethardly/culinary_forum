export interface IUser {
  email: string;
  password: string;
  token: string;
  role: 'admin' | 'user';
  displayName: string;
}
