import { IRole } from './types';

export const apiURL = 'http://localhost:8000';
export const GOOGLE_CLIENT_ID = '644853655791-aagep5ngc5upk12buod5752s7bvp22r6.apps.googleusercontent.com';

export const ROLES: IRole[] = [
  {
    prettyName: 'Администратор',
    name: 'admin',
  },
  {
    prettyName: 'Пользователь',
    name: 'user',
  },
];
