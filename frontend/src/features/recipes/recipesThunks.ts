import { createAsyncThunk } from '@reduxjs/toolkit';
import { IRecipe } from '../../types';
import axiosApi from '../../axios';

export const fetchRecipes = createAsyncThunk<IRecipe[]>('city/fetchCities', async () => {
  const response = await axiosApi.get<IRecipe[]>('/recipes');
  return response.data;
});
