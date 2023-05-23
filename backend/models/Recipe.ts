import { model, Schema, Types } from 'mongoose';
import { IRecipe } from '../types';
import User from './User';

const RecipeSchema = new Schema<IRecipe>({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  photoGallery: {
    type: [String],
    default: [],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => User.findById(value),
      message: 'Данный пользователь не существует!',
    },
  },
});

const Recipe = model<IRecipe>('Recipe', RecipeSchema);
export default Recipe;
