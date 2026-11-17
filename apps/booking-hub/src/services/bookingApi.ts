import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DemoEvent } from '../types/event';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/bookings' }),
  endpoints: (builder) => ({
    getEvents: builder.query<DemoEvent[], void>({
      query: () => '/events',
    }),
  }),
});

export const { useGetEventsQuery } = bookingApi;
