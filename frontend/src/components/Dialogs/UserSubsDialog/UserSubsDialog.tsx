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
import { PersonAdd as PersonAddIcon, PersonAddDisabled as PersonAddDisabledIcon } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { getOneUser, removeSubscriber, subscribeToUser } from '../../../features/users/usersThunks';
import { useAppDispatch } from '../../../app/hooks';

export interface SimpleDialogProps {
  user: User;
  open: boolean;
  onClose: () => void;
  type: 'Подписки' | 'Подписчики';
}

const UserSubsDialog: React.FC<SimpleDialogProps> = ({ user, open, onClose, type }) => {
  const dispatch = useAppDispatch();
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

  const handleButtonClick = async (e: React.MouseEvent, sup: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'Подписки') {
      await dispatch(subscribeToUser(sup));
    } else {
      await dispatch(removeSubscriber(sup));
    }

    await dispatch(getOneUser());
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{type}</DialogTitle>
      <List sx={{ p: 2 }}>
        {users.length === 0 && <Typography>У вас нет {type === 'Подписки' ? 'подписок' : 'подписчиков'}</Typography>}
        {users.map((user) => (
          <ListItem key={crypto.randomUUID()} disableGutters>
            <ListItemButton onClick={() => handleListItemClick()}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.displayName} />
              <Button sx={{ ml: 'auto' }} onClick={(e) => handleButtonClick(e, user._id)}>
                {user.subscriptions?.find((sup) => sup._id !== user._id) ? (
                  <PersonAddDisabledIcon />
                ) : (
                  <PersonAddIcon />
                )}
              </Button>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default UserSubsDialog;
