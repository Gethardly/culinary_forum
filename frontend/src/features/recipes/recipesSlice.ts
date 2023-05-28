import { IRecipe } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { fetchRecipes } from './recipesThunks';
import { RootState } from '../../app/store';

interface RecipesState {
  recipeList: IRecipe[];
  getAllRecipesLoading: boolean;
}

const initialState: RecipesState = {
  recipeList: [],
  getAllRecipesLoading: false,
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
  },
});

export const recipeReducer = recipesSlice.reducer;
export const selectRecipesList = (state: RootState) => state.recipe.recipeList;
