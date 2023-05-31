import { IRecipe, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { createRecipe, fetchRecipes } from './recipesThunks';
import { RootState } from '../../app/store';

interface RecipesState {
  recipeList: IRecipe[];
  getAllRecipesLoading: boolean;
  createLoading: boolean;
  createError: ValidationError | null;
}

const initialState: RecipesState = {
  recipeList: [],
  getAllRecipesLoading: false,
  createLoading: false,
  createError: null,
};

export const recipesSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecipes.pending, (state) => {
      state.getAllRecipesLoading = true;
    });
    builder.addCase(fetchRecipes.fulfilled, (state, { payload: recipeList }) => {
      state.getAllRecipesLoading = false;
      state.recipeList = recipeList;
    });
    builder.addCase(fetchRecipes.rejected, (state) => {
      state.getAllRecipesLoading = false;
    });

    builder.addCase(createRecipe.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createRecipe.fulfilled, (state) => {
      state.createLoading = false;
    });
    builder.addCase(createRecipe.rejected, (state, { payload: error }) => {
      state.createLoading = false;
      state.createError = error || null;
    });
  },
});

export const recipeReducer = recipesSlice.reducer;
export const selectRecipesList = (state: RootState) => state.recipe.recipeList;
export const selectCreateRecipeLoading = (state: RootState) => state.recipe.createLoading;
export const selectCreateRecipeError = (state: RootState) => state.recipe.createError;
