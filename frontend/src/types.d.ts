export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
  avatar: string | null;
  subscribers: User[];
  subscriptions: User[];
  recipes: string[];
  googleId?: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface UsersListResponse {
  users: User[];
  page: number;
  pages: number;
  perPage: number;
  count: number;
}

export interface UserMutation {
  email: string;
  password: string;
  role: string;
  displayName: string;
  avatar: string | null;
}

export interface IRole {
  prettyName: string;
  name: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface GlobalError {
  error: string;
}

export interface DeletedUserResponse {
  acknowledged: boolean;
  deletedCount: number;
}

export interface IRecipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  photoGallery: string[];
  owner: User;
}

export interface IRecipeMutation {
  title: string;
  ingredients: string[];
  instructions: string;
  photoGallery: File[];
  owner: string;
}

export interface Message {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  createdAt: Date;
}

export interface IncomingMessage {
  type: string;
  payload: Message;
}
