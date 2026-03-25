import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL || 'https://h2f6t8-5000.csb.app/api'
  }),
  tagTypes: ['Messages', 'Users'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getMessages: builder.query({
      query: (roomId) => `/messages/${roomId}`,
      providesTags: (result, error, roomId) => [
        { type: 'Messages', id: roomId },
      ],
    }),
    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: '/messages',
        method: 'POST',
        body: newMessage,
      }),
      async onQueryStarted(newMessage, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages', newMessage.roomId, (draft) => {
            draft.push(newMessage);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    loginUser: builder.mutation({
      query: (username) => ({
        url: '/users/login',
        method: 'POST',
        body: { username },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useLoginUserMutation,
} = chatApi;
