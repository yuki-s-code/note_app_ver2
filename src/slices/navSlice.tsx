import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import type { RootState } from '../libs/app/store';
import { OPENNAV } from '../libs/types/common';

export interface NavState {
  nav: OPENNAV;
}

const initialState: NavState = {
  nav: {
    name: '',
  },
};

export const NavSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setNav: (state, action: PayloadAction<OPENNAV>) => {
      state.nav = action.payload;
    },
    resetNav: (state) => {
      state.nav = initialState.nav;
    },
  },
});

export const { setNav, resetNav } = NavSlice.actions;

export const selectNav = (state: RootState) => state.nav.nav;

export default NavSlice.reducer;
