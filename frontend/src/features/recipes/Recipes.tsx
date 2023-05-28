import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRecipesList } from './recipesSlice';
import { fetchRecipes } from './recipesThunks';
import { Grid } from '@mui/material';
import RecipeItem from './components/RecipeItem';
import { useParams } from 'react-router-dom';

const Recipes = () => {
  const { id } = useParams();
  console.log(id);
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(selectRecipesList);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);
  return (
    <Grid container spacing={2}>
      {recipes.map((recipe) => (
        <RecipeItem
          key={recipe._id}
          title={recipe.title}
          id={recipe._id}
          photoGallery={recipe.photoGallery}
          ingredients={recipe.ingredients}
          instructions={recipe.instructions}
          owner={recipe.owner}
        />
      ))}
    </Grid>
  );
};

export default Recipes;
