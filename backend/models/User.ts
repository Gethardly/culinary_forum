import { HydratedDocument, Model, model, Schema, Types } from 'mongoose';
import { IUser } from '../types';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import Recipe from './Recipe';

const SALT_WORK_FACTOR = 10;

interface IUserMethods {
  checkPassword(password: string): Promise<boolean>;

  generateToken(): void;
}

type UserModel = Model<IUser, object, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (this: HydratedDocument<IUser>, email: string): Promise<boolean> {
        if (!this.isModified('email')) return true;
        const user: HydratedDocument<IUser> | null = await User.findOne({
          email,
        });
        return !user;
      },
      message: 'This email is already registered',
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin'],
  },
  displayName: {
    type: String,
    required: true,
  },
  recipes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      validate: {
        validator: async (value: Types.ObjectId) => Recipe.findById(value),
        message: 'Данного рецепта не существует!',
      },
    },
  ],
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async (value: Types.ObjectId) => User.findById(value),
        message: 'Данный пользователь не существует!',
      },
    },
  ],
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async (value: Types.ObjectId) => User.findById(value),
        message: 'Данный пользователь не существует!',
      },
    },
  ],
  avatar: {
    type: String,
  },
  googleId: {
    type: String,
    default: '',
  },
});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (e) {
    return next();
  }

  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = model<IUser, UserModel>('User', UserSchema);
export default User;
