import React from 'react';
import { AppBar, Grid, styled, Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import AnonymousMenu from './AnonymousMenu';
import UserMenu from './UserMenu';
import { NavLink } from 'react-router-dom';

const StyledLink = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
    textDecoration: 'none',
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Grid container sx={{ alignItems: 'center' }}>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, alignItems: 'center' }}>
            <StyledLink to="/">Culinary forum</StyledLink>
          </Typography>
          <Grid>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
