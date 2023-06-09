import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, Button, Divider, Grid, List, Paper, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { makeStyles } from '@mui/styles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMessages, fetchRecipients } from './messagesThunks';
import { selectUser } from '../users/usersSlice';
import { IncomingMessage, Message, User } from '../../types';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllUsersInfo } from '../users/usersThunks';
import MessageItem from './components/MessageItem';
import ChatedUsers from './components/ChatedUsers';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
  },
  headBG: {
    backgroundColor: '#e0e0e0',
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
  },
  messageArea: {
    height: '65vh',
    overflowY: 'auto',
  },
});

interface UsersLink {
  id: string;
  label: string;
}

const Chats = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser) as User;
  const [usersList, setUsersList] = useState<UsersLink[]>([]);
  const [recipients, setRecipients] = useState<User[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const messageListRef = useRef<HTMLUListElement>(null);
  const classes = useStyles();

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsRef.current) return;

    const newMessage = {
      sender: currentUser._id,
      recipient: id,
      content: newMessageText,
    };

    await wsRef.current.send(
      JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: newMessage,
      }),
    );

    setNewMessageText('');
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMessages(id))
        .unwrap()
        .then((messages) => setAllMessages(messages));
    }

    dispatch(getAllUsersInfo())
      .unwrap()
      .then((users) =>
        setUsersList(
          users.map((user) => {
            return {
              id: user._id,
              label: user.displayName,
            };
          }),
        ),
      );

    wsRef.current = new WebSocket('ws://localhost:8000/chat');

    wsRef.current.onopen = () => {
      wsRef.current?.send(
        JSON.stringify({
          type: 'auth',
          payload: currentUser.token,
        }),
      );
    };

    wsRef.current.onmessage = (message) => {
      const decodedMessage = JSON.parse(message.data) as IncomingMessage;
      if (decodedMessage.type === 'NEW_MESSAGE') {
        setAllMessages((prev) => [...prev, decodedMessage.payload]);
      }
    };
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [dispatch, id, currentUser.token]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }

    dispatch(fetchRecipients())
      .unwrap()
      .then((recipients) => setRecipients(recipients));
  }, [allMessages, dispatch]);
  return (
    <>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <Grid item xs={12} style={{ padding: '10px' }}>
            <Autocomplete
              disablePortal
              onChange={(event, newValue: UsersLink | null) => {
                if (newValue?.id !== undefined) {
                  navigate('/messages/' + newValue.id);
                }
              }}
              options={usersList.filter((user) => user.id !== currentUser._id)}
              noOptionsText="Нет совпадений"
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Выберите пользователя" />}
            />
          </Grid>
          <Divider />
          <List>
            {recipients.map((recipient) => (
              <ChatedUsers key={recipient._id + 1} user={recipient} routeId={id} />
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          {allMessages.length === 0 ? (
            <Grid className={classes.messageArea} display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h4" color="grey">
                Выберите чат
              </Typography>
            </Grid>
          ) : (
            <List className={classes.messageArea} ref={messageListRef} sx={{ px: 3 }}>
              {allMessages.map((message) =>
                currentUser._id === message.sender._id ? (
                  <MessageItem key={message._id} user={message.sender} message={message} flexContent="flex-end" />
                ) : (
                  <MessageItem key={message._id} user={message.sender} message={message} flexContent="flex-start" />
                ),
              )}
            </List>
          )}
          <Divider />
          <Box component="form" onSubmit={sendMessage}>
            <Grid container style={{ padding: '20px' }}>
              <Grid item xs={11}>
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  fullWidth
                  required
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                />
              </Grid>
              <Grid item xs={1}>
                <Button type="submit" color="primary" aria-label="add" disabled={newMessageText.length === 0}>
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default Chats;
