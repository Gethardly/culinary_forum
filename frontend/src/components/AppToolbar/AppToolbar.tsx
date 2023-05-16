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
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container sx={{ alignItems: 'center' }}>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, alignItems: 'center' }}>
            <StyledLink to="/">Culinary forum</StyledLink>
          </Typography>
          <Grid item>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
