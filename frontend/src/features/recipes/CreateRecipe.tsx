import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCreateRecipeError, selectCreateRecipeLoading } from './recipesSlice';
import { IRecipeMutation, User } from '../../types';
import { createRecipe } from './recipesThunks';
import { Container } from '@mui/material';
import { openSnackbar, selectUser } from '../users/usersSlice';
import RecipeForm from './components/RecipeForm';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectCreateRecipeLoading);
  const error = useAppSelector(selectCreateRecipeError);
  const user = useAppSelector(selectUser) as User;

  if (!user) {
    navigate('/');
  }

  const submitFormHandler = async (recipe: IRecipeMutation) => {
    await dispatch(createRecipe(recipe)).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_location' }));
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <RecipeForm user={user} error={error} onSubmit={submitFormHandler} isLoading={creating} />
    </Container>
  );
};

export default CreateRecipe;
