import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axios';
import { Message, User } from '../../types';

export const fetchMessages = createAsyncThunk<Message[], string>('messages/getAll', async (id: string) => {
  const messages = await axiosApi.get('/messages/' + id);
  return messages.data;
});

export const fetchRecipients = createAsyncThunk<User[]>('messages/getRecipients', async () => {
  const recipients = await axiosApi.get('/messages');
  return recipients.data;
});
