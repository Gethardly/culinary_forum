import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axios';
import {
  DeletedUserResponse,
  GlobalError,
  LoginMutation,
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
      const formData = new FormData();

      const keys = Object.keys(registerMutation) as (keyof UserMutation)[];

      keys.forEach((key) => {
        const value = registerMutation[key];

        if (value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axiosApi.post('/users', formData);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const logout = createAsyncThunk<void, void, { state: RootState }>('users/logout', async (_, { dispatch }) => {
  await axiosApi.delete('/users/sessions');
  dispatch(unsetUser());
});

type RequestParams = { page: number; perPage: number } | undefined;

export const getUsersList = createAsyncThunk<UsersListResponse, RequestParams>('users/getAll', async (params) => {
  try {
    let queryString = '';
    if (params) {
      queryString = `?page=${params.page}&perPage=${params.perPage}`;
    }
    const response = await axiosApi.get<UsersListResponse>(`/users/list${queryString}`);
    return response.data;
  } catch (e) {
    throw new Error('getUserList function: Something went wrong!');
  }
});

export const getEditingUser = createAsyncThunk<UserMutation, string>('users/getOneEdit', async (userId: string) => {
  try {
    const response = await axiosApi.get<User>('/users?user=' + userId);
    const { email, displayName, role, avatar } = response.data;
    return { email, displayName, role, avatar, password: '' };
  } catch (e) {
    throw new Error('Not found!');
  }
});

export const getOneUser = createAsyncThunk<User>('users/getOne', async () => {
  try {
    const response = await axiosApi.get<User>('/users');
    return response.data;
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
    const formData = new FormData();
    const keys = Object.keys(params.user) as (keyof UserMutation)[];
    const currentUser = getState().users.user;

    keys.forEach((key) => {
      const value = params.user[key];
      if (value !== null) {
        formData.append(key, value);
      }
    });

    const response = await axiosApi.put('users/' + params.id, formData);
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

export const subscribeToUser = createAsyncThunk<void, string>('users/subscribe', async (id: string) => {
  try {
    await axiosApi.post('users/subscribe/' + id);
  } catch (e) {
    throw new Error('Something went wrong with subscribe!');
  }
});

export const removeSubscriber = createAsyncThunk<void, string>(
  'users/removeSubscriber',
  async (subscriberId: string) => {
    try {
      await axiosApi.post('users/remove_follower/' + subscriberId);
    } catch (e) {
      throw new Error('Something went wrong with remove follower');
    }
  },
);

export const googleLogin = createAsyncThunk<User, string, { rejectValue: GlobalError }>(
  'users/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<UserResponse>('/users/google', { credential });
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const getAllUsersInfo = createAsyncThunk<User[]>('/users/getAll', async () => {
  const users = await axiosApi.get('/users/all');
  return users.data;
});
