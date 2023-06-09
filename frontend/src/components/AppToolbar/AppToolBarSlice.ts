import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface AppToolBarState {
  hideAppBar: boolean;
}

const initialState: AppToolBarState = {
  hideAppBar: false,
};

const AppToolBarSlice = createSlice({
  name: 'AppToolBar',
  initialState,
  reducers: {
    hideAppBar: (state, action) => {
      state.hideAppBar = action.payload;
    },
  },
});

export const appBarReducer = AppToolBarSlice.reducer;
export const { hideAppBar } = AppToolBarSlice.actions;
export const selectAppBar = (state: RootState) => state.appBar.hideAppBar;
