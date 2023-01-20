import { createSlice } from "@reduxjs/toolkit";


const loginSlice = createSlice({
    name: 'login',
    initialState: {
        token: undefined,
        username: '',
        email: ''
    },
    reducers: {
        setToken(state, action) {
            return {
                ...state,
                token: action.payload
            }
        },
        setLoggedUserData(state, { payload: { username, email } }) {
            return {
                ...state,
                email,
                username
            }
        }
    },
})

export const { setToken, setLoggedUserData } = loginSlice.actions
export default loginSlice.reducer