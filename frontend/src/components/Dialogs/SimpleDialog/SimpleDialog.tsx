import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { User } from '../../../types';

export interface SimpleDialogProps {
  user: User;
  open: boolean;
  onClose: () => void;
  type: 'Подписки' | 'Подписчики';
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({ user, open, onClose, type }) => {
  let users: User[];
  if (type === 'Подписки') {
    users = user.subscriptions;
  } else {
    users = user.subscribers;
  }
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{type}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.map((user) => (
          <ListItem key={user._id} disableGutters>
            <ListItemButton onClick={() => handleListItemClick()}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.displayName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default SimpleDialog;
