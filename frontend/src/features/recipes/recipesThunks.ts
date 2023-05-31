import { createAsyncThunk } from '@reduxjs/toolkit';
import { IRecipe, IRecipeMutation, ValidationError } from '../../types';
import axiosApi from '../../axios';
import { isAxiosError } from 'axios';

export const fetchRecipes = createAsyncThunk<IRecipe[], string | undefined>('city/fetchCities', async (userId) => {
  try {
    if (!userId) {
      const response = await axiosApi.get<IRecipe[]>('/recipes');
      return response.data;
    }
    const response = await axiosApi.get<IRecipe[]>('/recipes/' + userId);
    return response.data;
  } catch (e) {
    throw new Error('fetchRecipes: Something went wrong');
  }
});

export const createRecipe = createAsyncThunk<IRecipe, IRecipeMutation, { rejectValue: ValidationError }>(
  'recipe/create',
  async (newRecipe: IRecipeMutation, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('owner', newRecipe.owner);
      formData.append('title', newRecipe.title);
      formData.append('instructions', newRecipe.instructions);

      newRecipe.ingredients.forEach((ing, index) => {
        formData.append(`ingredients[${index}]`, ing);
      });

      newRecipe.photoGallery.forEach((photo, index) => {
        formData.append(`photoGallery[${index}]`, photo);
      });

      const response = await axiosApi.post('/recipes', formData);
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);
