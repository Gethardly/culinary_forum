import React, { useState } from 'react';
import { Alert, Avatar, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { UserMutation, ValidationError } from '../../../types';
import { ROLES } from '../../../constants';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../usersSlice';

interface Props {
  onSubmit: (user: UserMutation) => void;
  existingUser?: UserMutation;
  isEdit?: boolean;
  isLoading: boolean;
  error: ValidationError | null;
}

const initialState: UserMutation = {
  email: '',
  displayName: '',
  role: 'user',
  password: '',
};

const UserForm: React.FC<Props> = ({ onSubmit, existingUser = initialState, isEdit, isLoading, error }) => {
  const [state, setState] = useState<UserMutation>(existingUser);
  const user = useAppSelector(selectUser);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(state);
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
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOpenIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {isEdit ? 'Редактирование' : 'Регистрация'}
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
              label="Email пользователя"
              type="email"
              name="email"
              autoComplete="off"
              value={state.email}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Имя пользователя"
              name="displayName"
              autoComplete="off"
              value={state.displayName}
              onChange={inputChangeHandler}
            />
          </Grid>
          {user?.role === 'admin' && (
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                label="Роль пользователя"
                name="role"
                value={state.role}
                onChange={inputChangeHandler}
              >
                <MenuItem value="" disabled>
                  Выбрать роль
                </MenuItem>
                {ROLES.map((role) => (
                  <MenuItem key={role.name} value={role.name}>
                    {role.prettyName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              required={!isEdit}
              fullWidth
              label="Пароль пользователя"
              name="password"
              type="password"
              autoComplete="off"
              value={state.password}
              onChange={inputChangeHandler}
            />
          </Grid>
        </Grid>
        <Button
          disabled={state.email === '' || state.displayName === '' || isLoading || (!isEdit && state.password === '')}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isEdit ? 'Редактировать' : 'Зарегистрироваться'}
        </Button>
      </Box>
    </Box>
  );
};
export default UserForm;
