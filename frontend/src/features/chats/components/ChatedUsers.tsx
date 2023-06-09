import React from 'react';
import { Avatar, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { apiURL } from '../../../constants';
import { User } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: User;
  routeId: string | undefined;
}

const ChatedUsers: React.FC<Props> = ({ user, routeId }) => {
  const navigate = useNavigate();

  return (
    <ListItem
      sx={{ cursor: 'pointer', bgcolor: user._id === routeId ? 'lightgrey' : '' }}
      key={user._id}
      onClick={() => navigate('/messages/' + user._id)}
    >
      <ListItemIcon>
        <Avatar
          alt="Remy Sharp"
          src={
            user.googleId
              ? (user.avatar as string)
              : user.avatar
              ? ((apiURL + '/images/avatars/' + user.avatar) as string)
              : ''
          }
        />
      </ListItemIcon>
      <ListItemText primary={user.displayName}>{user.displayName}</ListItemText>
    </ListItem>
  );
};

export default ChatedUsers;
