import React from 'react';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const AnonymousMenu = () => {
  return (
    <>
      <Button component={NavLink} to="/register" color="inherit">
        Зарегистрироваться
      </Button>
      <Button component={NavLink} to="/login" color="inherit">
        Войти
      </Button>
    </>
  );
};

export default AnonymousMenu;
