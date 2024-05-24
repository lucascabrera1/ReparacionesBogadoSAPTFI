import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'

const urlApi = process.env.REACT_APP_URI_API

export const login = createAsyncThunk('auth/login', async ({email, password}) => {
    const url = `${urlApi}/auth/signin`
    const user = {
        email: email,
        password: password
    }
    try {
        const response = await axios.post(url, user)
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const authSlice = createSlice ({
    name: 'auth',
    initialState: {
        user : null,
        accessToken: null,
    },
    reducers: {
        logOut: (state, action) => {
            state.user = null
            state.accessToken = null
            axios.defaults.headers.common.Authorization = ""
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            state.accessToken = action.payload.token
            state.user = action.payload.user
            axios.defaults.headers.common.Authorization = `Bearer ${state.accessToken}`
        })
    }
})

export const {logOut} = authSlice.actions
export default authSlice.reducer
export const selectCurrentToken = (state) =>  state.auth?.accessToken
export const selectCurrentUser = (state) => state.auth?.user