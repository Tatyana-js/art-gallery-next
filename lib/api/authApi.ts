// import FingerprintJS from '@fingerprintjs/fingerprintjs';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_URL,
//     prepareHeaders: async (headers) => {
//       let fingerprint = localStorage.getItem('fingerprint');
//       if (!fingerprint) {
//         const fp = await FingerprintJS.load();
//         const result = await fp.get();
//         fingerprint = result.visitorId;
//         localStorage.setItem('fingerprint', fingerprint);
//       }
//       headers.set('X-Fingerprint', fingerprint);
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     register: builder.mutation<
//       { accessToken: string; refreshToken: string },
//       { username: string; password: string }
//     >({
//       query: (data) => ({
//         url: '/auth/register',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     refreshToken: builder.mutation<
//       {
//         refreshToken: string;
//         accessToken: string;
//       },
//       { refreshToken: string }
//     >({
//       query: (data) => ({
//         url: '/auth/refresh',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     login: builder.mutation<
//       {
//         accessToken: string;
//         refreshToken: string;
//       },
//       { username: string; password: string }
//     >({
//       query: (data) => {
//         const fingerprint = localStorage.getItem('fingerprint');
//         return {
//           url: '/auth/login',
//           method: 'POST',
//           body: {
//             ...data,
//             fingerprint: fingerprint,
//           },
//         };
//       },
//     }),
//   }),
// });

// export const {
//   useRegisterMutation,
//   useRefreshTokenMutation,
//   useLoginMutation,
// } = authApi;
