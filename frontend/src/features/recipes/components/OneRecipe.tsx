import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectOneRecipe } from '../recipesSlice';
import { useParams } from 'react-router-dom';
import { getOneRecipe } from '../recipesThunks';
import PhotoCarousel from '../../../components/Carousel/PhotoCarousel';
import { apiURL } from '../../../constants';

const OneRecipe = () => {
  const url = apiURL + '/images/recipe_photos/';
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const recipe = useAppSelector(selectOneRecipe);

  useEffect(() => {
    if (id) {
      dispatch(getOneRecipe(id));
    }
  }, [dispatch, id]);
  return (
    <>
      {recipe && (
        <Grid container spacing={3} direction="column" sx={{ px: '20%' }}>
          <Typography variant="h2">{recipe.title}</Typography>
          <Grid item sx={{ px: '20%' }}>
            <PhotoCarousel url={url} images={recipe.photoGallery} />
          </Grid>
          <Grid item>
            <Typography variant="h5">Ингредиенты</Typography>
            <Typography component="ol">
              {recipe.ingredients.map((ing, index) => (
                <Typography component="li" key={index}>
                  {ing}
                </Typography>
              ))}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5">Описание</Typography>
            <Typography component="p">{recipe.instructions}</Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default OneRecipe;
