import { configureStore } from '@reduxjs/toolkit';
import queryParamsSlice from './queryParams/queryParamsSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    queryParams: queryParamsSlice,

  },
});
export type storeType = typeof store.dispatch
export default store;

