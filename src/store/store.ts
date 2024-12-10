import { configureStore } from '@reduxjs/toolkit';
import dogsReducer from './dogsSlice';

export const store = configureStore({
  reducer: {
    dogs: dogsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;