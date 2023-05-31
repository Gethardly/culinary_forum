import React, { useState } from 'react';
import { IRecipe, IRecipeMutation, User, ValidationError } from '../../../types';
import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  user: User;
  onSubmit: (location: IRecipeMutation) => void;
  isLoading: boolean;
  error: ValidationError | null;
  isEdit?: boolean;
  existingRecipe?: IRecipeMutation;
}

const initialState: IRecipeMutation = {
  owner: '',
  title: '',
  instructions: '',
  photoGallery: [],
  ingredients: [],
};

const RecipeForm: React.FC<Props> = ({ user, onSubmit, isLoading, error, existingRecipe = initialState, isEdit }) => {
  initialState.owner = user._id;
  const [state, setState] = useState<IRecipeMutation>(existingRecipe);

  const inputChangeHandler = (field: keyof IRecipe, value: string | string[]) => {
    setState((prevState) => ({ ...prevState, [field]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(state);
  };

  const handleAddElement = (fieldName: 'ingredients' | 'photoGallery') => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: [...prevState[fieldName], ''],
    }));
  };

  const handleRemoveElement = (fieldName: 'ingredients' | 'photoGallery', index: number) => {
    setState((prevRecipe) => {
      const updatedInfo = [...prevRecipe[fieldName]];
      updatedInfo.splice(index, 1);
      return {
        ...prevRecipe,
        ingredients: updatedInfo,
      };
    });
  };

  const renderInstructionsLength = (text: string) => {
    return text.replace(/\./g, '\n');
  };
  return (
    <Box
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        {isEdit ? 'Редактирование' : 'Создание рецепта'}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
          {error.message}
        </Alert>
      )}
      <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3, width: '100%' }}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Название рецепта"
              type="text"
              name="title"
              autoComplete="off"
              value={state.title}
              onChange={(e) => inputChangeHandler('title', e.target.value)}
            />
          </Grid>
          <Grid item xs={11} display="flex" alignItems="center">
            <TextField
              required
              fullWidth
              label="Ингредиент"
              name="ingredients"
              value={state.ingredients[0]}
              onChange={(e) => {
                inputChangeHandler('ingredients', [e.target.value]);
              }}
            />
            {state.ingredients.length < 2 ? (
              <Button onClick={() => handleAddElement('ingredients')} startIcon={<AddIcon />}>
                Add ingredients
              </Button>
            ) : (
              <></>
            )}
          </Grid>
          {state.ingredients.map((ing, index) =>
            index > 0 ? (
              <Grid key={index} item xs={11} display="flex" alignItems="center">
                <TextField
                  required
                  fullWidth
                  label="Ингредиент"
                  name="ingredients"
                  value={ing}
                  onChange={(e) => {
                    inputChangeHandler('ingredients', [
                      ...state.ingredients.slice(0, index),
                      e.target.value,
                      ...state.ingredients.slice(index + 1),
                    ]);
                  }}
                />
                <Button sx={{ ml: 2 }} onClick={() => handleRemoveElement('ingredients', index)}>
                  <DeleteIcon />
                </Button>
                <Button onClick={() => handleAddElement('ingredients')}>
                  <AddIcon />
                </Button>
              </Grid>
            ) : (
              ''
            ),
          )}
          <Grid item xs={12}>
            <TextField
              required={!isEdit}
              fullWidth
              multiline
              label="Описание"
              name="instructions"
              type="text"
              autoComplete="off"
              value={renderInstructionsLength(state.instructions)}
              onChange={(e) => inputChangeHandler('instructions', e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          disabled={state.title === '' || state.ingredients.length === 0 || state.instructions === '' || isLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isEdit ? 'Редактировать рецепт' : 'Создать рецепт'}
        </Button>
      </Box>
    </Box>
  );
};
export default RecipeForm;
