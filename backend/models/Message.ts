import { model, Schema, Types } from 'mongoose';
import User from './User';
import { IMessage } from '../types';

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => User.findById(value),
      message: 'Данный пользователь не существует!',
    },
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => User.findById(value),
      message: 'Данный пользователь не существует!',
    },
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = model<IMessage>('Message', messageSchema);
export default Message;
