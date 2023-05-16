import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axios';
import {
  DeletedUserResponse,
  GlobalError,
  LoginMutation,
  RegisterResponse,
  User,
  UserMutation,
  UserResponse,
  UsersListResponse,
  ValidationError,
} from '../../types';
import { isAxiosError } from 'axios';
import { setUser, unsetUser } from './usersSlice';
import { AppDispatch, RootState } from '../../app/store';

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<UserResponse>('/users/sessions', loginMutation);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400)
        return rejectWithValue(e.response.data as GlobalError);

      throw e;
    }
  },
);

export const createUser = createAsyncThunk<void, UserMutation, { rejectValue: ValidationError }>(
  'users/create',
  async (registerMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post<RegisterResponse>('/users', registerMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const logout = createAsyncThunk<void, void, { state: RootState }>('users/logout', async (_, { dispatch }) => {
  dispatch(unsetUser());
  await axiosApi.delete('/users/sessions');
});

type RequestParams = { page: number; perPage: number } | undefined;

export const getUsersList = createAsyncThunk<UsersListResponse, RequestParams>('users/getAll', async (params) => {
  let queryString = '';
  if (params) {
    queryString = `?page=${params.page}&perPage=${params.perPage}`;
  }
  const response = await axiosApi.get<UsersListResponse>(`/users${queryString}`);
  return response.data;
});

export const getEditingUser = createAsyncThunk<UserMutation, string>('users/getOne', async (id: string) => {
  try {
    const response = await axiosApi.get<User>('/users/' + id);
    const { email, displayName, role } = response.data;
    return { email, displayName, role, password: '' };
  } catch (e) {
    throw new Error('Not found!');
  }
});

interface UpdateUserParams {
  id: string;
  user: UserMutation;
}

export const updateUser = createAsyncThunk<
  void,
  UpdateUserParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('users/editOne', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentUser = getState().users.user;
    const response = await axiosApi.put('users/' + params.id, params.user);
    if (currentUser && currentUser._id === params.id) {
      dispatch(setUser(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const deleteUser = createAsyncThunk<DeletedUserResponse, string>('users/deleteOne', async (userId) => {
  const response = await axiosApi.delete('/users/' + userId);
  return response.data;
});
