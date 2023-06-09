import React from 'react';
import { Container } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, UserMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createUser } from './usersThunks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import UserForm from './components/UserForm';

interface Props {
  user: User | null;
}

const CreateUser: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);

  if (user) {
    return <Navigate to="/" />;
  }

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
