import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate, useOutlet } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ReorderIcon from '@mui/icons-material/Reorder';
import UsersList from './UsersList';

const Users = () => {
  const navigate = useNavigate();
  const outlet = useOutlet();

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/users');
            }}
          >
            <ReorderIcon sx={{ mr: 1 }} />
            Список
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/register');
            }}
          >
            <GroupAddIcon sx={{ mr: 1 }} />
            Регистрация
          </Button>
        </Grid>
      </Grid>
      <Box>{outlet ? outlet : <UsersList />}</Box>
    </Box>
  );
};

export default Users;
