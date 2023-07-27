import { configureStore } from '@reduxjs/toolkit';
import { kahootSlice } from '../reducers';

// eslint-disable-next-line import/prefer-default-export
export const kahootStore = configureStore({
  reducer: kahootSlice,
});
