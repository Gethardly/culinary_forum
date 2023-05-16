import React from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createUser } from './usersThunks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import UserForm from './components/UserForm';

const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);

  const submitFormHandler = async (user: UserMutation) => {
    await dispatch(createUser(user)).unwrap();
    navigate('/users');
  };

  return (
    <Container component="main" maxWidth="xs">
      <UserForm error={error} onSubmit={submitFormHandler} isLoading={creating} />
    </Container>
  );
};

export default CreateUser;
