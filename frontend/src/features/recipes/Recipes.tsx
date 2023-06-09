import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRecipesList } from './recipesSlice';
import { fetchRecipes } from './recipesThunks';
import { Button, Container, Grid } from '@mui/material';
import RecipeItem from './components/RecipeItem';
import { useNavigate, useOutlet, useParams } from 'react-router-dom';
import { selectUser } from '../users/usersSlice';
import { getOneUser, subscribeToUser } from '../users/usersThunks';

const Recipes = () => {
  const user = useAppSelector(selectUser);
  const outlet = useOutlet();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(selectRecipesList);

  const subscribe = async (ownerId: string) => {
    await dispatch(subscribeToUser(ownerId));
    await dispatch(getOneUser());
  };

  useEffect(() => {
    if (!id) {
      dispatch(fetchRecipes());
    }
    dispatch(fetchRecipes(id));
  }, [dispatch, id]);
  return (
    <Grid sx={{ p: 1, pt: 0 }}>
      {user ? (
        <Grid container justifyContent="right" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/create_recipe');
            }}
          >
            Создать рецепт
          </Button>
        </Grid>
      ) : (
        ''
      )}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {!outlet
            ? recipes.map((recipe) => (
                <RecipeItem
                  key={recipe._id}
                  id={recipe._id}
                  title={recipe.title}
                  photoGallery={recipe.photoGallery}
                  instructions={recipe.instructions}
                  owner={recipe.owner}
                  currentUser={user}
                  subscribe={subscribe}
                />
              ))
            : outlet}
        </Grid>
      </Container>
    </Grid>
  );
};

export default Recipes;
