import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { bookingApi } from '../services/bookingApi';

export const store = configureStore({
  reducer: { [bookingApi.reducerPath]: bookingApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bookingApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
