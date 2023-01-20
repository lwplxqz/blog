import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "./postsApi";
import loginReducer from './loginSlice'

const store = configureStore({
    reducer: {
        login: loginReducer,
        [postsApi.reducerPath]: postsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(postsApi.middleware)
})

export default store