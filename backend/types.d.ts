import { Schema } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  token: string;
  role: 'admin' | 'user';
  displayName: string;
  subscribers: Schema.Types.ObjectId[];
  subscriptions: Schema.Types.ObjectId[];
  recipes: Schema.Types.ObjectId[];
  avatar?: string | null;
}

export interface IRecipe {
  title: string;
  ingredients: string[];
  instructions: string;
  photoGallery: string[];
  owner: Schema.Types.ObjectId;
}
