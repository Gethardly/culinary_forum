import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeletedUserResponse, GlobalError, User, UserMutation, UsersListResponse, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { createUser, deleteUser, updateUser, getEditingUser, getUsersList, login } from './usersThunks';

interface UsersState {
  user: User | null;
  usersListData: UsersListResponse;
  oneUser: User | null;
  oneEditUser: UserMutation | null;
  deletedUserResponse: DeletedUserResponse | null;
  getOneLoading: boolean;
  getAllLoading: boolean;
  loginError: GlobalError | null;
  registerError: ValidationError | null;
  editingError: ValidationError | null;
  loginLoading: boolean;
  registerLoading: boolean;
  deleteOneLoading: boolean;
  editOneLoading: boolean;
  snackbar: {
    status: boolean;
    parameter: string;
  };
}

const initialState: UsersState = {
  user: null,
  usersListData: {
    users: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  deletedUserResponse: null,
  oneUser: null,
  oneEditUser: null,
  loginError: null,
  registerError: null,
  editingError: null,
  getOneLoading: false,
  getAllLoading: false,
  deleteOneLoading: false,
  editOneLoading: false,
  loginLoading: false,
  registerLoading: false,
  snackbar: {
    status: false,
    parameter: '',
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetLoginError: (state) => {
      state.loginError = null;
    },
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.usersListData.page = page;
    },
    openSnackbar: (state, { payload: obj }: PayloadAction<{ status: boolean; parameter: string }>) => {
      state.snackbar = obj;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload: user }) => {
      state.loginLoading = false;
      state.user = user;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginError = error || null;
      state.loginLoading = false;
    });

    builder.addCase(createUser.pending, (state) => {
      state.registerLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.registerLoading = false;
    });
    builder.addCase(createUser.rejected, (state, { payload: error }) => {
      state.registerError = error || null;
      state.registerLoading = false;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.editingError = null;
      state.editOneLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state) => {
      state.editOneLoading = false;
    });
    builder.addCase(updateUser.rejected, (state, { payload: error }) => {
      state.editingError = error || null;
      state.editOneLoading = false;
    });

    builder.addCase(getUsersList.pending, (state) => {
      state.getAllLoading = true;
    });
    builder.addCase(getUsersList.fulfilled, (state, { payload }) => {
      state.usersListData = payload;
      state.getAllLoading = false;
    });
    builder.addCase(getUsersList.rejected, (state) => {
      state.getAllLoading = false;
    });

    builder.addCase(getEditingUser.pending, (state) => {
      state.oneEditUser = null;
      state.getOneLoading = true;
    });
    builder.addCase(getEditingUser.fulfilled, (state, { payload }) => {
      state.oneEditUser = payload;
      state.getOneLoading = false;
    });
    builder.addCase(getEditingUser.rejected, (state) => {
      state.getOneLoading = false;
    });

    builder.addCase(deleteUser.pending, (state) => {
      state.deleteOneLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, { payload: deletedUser }) => {
      state.deleteOneLoading = false;
      state.deletedUserResponse = deletedUser;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.deleteOneLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, setUser, resetLoginError, setCurrentPage, openSnackbar } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectOneEditingUser = (state: RootState) => state.users.oneEditUser;
export const selectEditOneUserLoading = (state: RootState) => state.users.editOneLoading;
export const selectEditingError = (state: RootState) => state.users.editingError;
export const selectOneUserLoading = (state: RootState) => state.users.getOneLoading;
export const selectDeleteOneUserLoading = (state: RootState) => state.users.deleteOneLoading;
export const selectDeletedUserResponse = (state: RootState) => state.users.deletedUserResponse;
export const selectUsersListData = (state: RootState) => state.users.usersListData;
export const selectUsersListLoading = (state: RootState) => state.users.getAllLoading;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectSnackbarState = (state: RootState) => state.users.snackbar;
