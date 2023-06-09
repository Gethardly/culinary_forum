import React from 'react';
import { Message, User } from '../../../types';
import { Avatar, Grid, ListItem, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import { apiURL } from '../../../constants';

interface Props {
  user: User;
  message: Message;
  flexContent: string;
}

const MessageItem: React.FC<Props> = ({ user, message, flexContent }) => {
  return (
    <ListItem
      key={message._id}
      sx={{
        display: 'flex',
        justifyContent: flexContent,
      }}
    >
      {flexContent === 'flex-start' ? (
        <Grid sx={{ mr: 2 }}>
          <Avatar
            src={
              user.googleId ? (user.avatar as string) : ((apiURL + '/images/avatars/' + user.avatar) as string) || ''
            }
          />
        </Grid>
      ) : (
        ''
      )}
      <Grid>
        <Grid item xs={12}>
          <ListItemText primary={message.content} />
        </Grid>
        <Grid item xs={12}>
          <ListItemText secondary={dayjs(message.createdAt).format('DD/MM/YYYY HH:mm')} />
        </Grid>
      </Grid>
      {flexContent === 'flex-end' ? (
        <Grid sx={{ ml: 2 }}>
          <Avatar
            src={
              user.googleId
                ? (user.avatar as string)
                : user.avatar
                ? ((apiURL + '/images/avatars/' + user.avatar) as string)
                : ''
            }
          />
        </Grid>
      ) : (
        ''
      )}
    </ListItem>
  );
};

export default MessageItem;
