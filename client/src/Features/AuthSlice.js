import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'

const urlApi = process.env.REACT_APP_URI_API
console.log(urlApi)

export const login = createAsyncThunk('auth/login', async ({email, contraseña}) => {
    console.log(urlApi)
    const url = `${urlApi}/signin`
    const user = {
        email: email, 
        contraseña: contraseña
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
    initialState: {user: null, accessToken: null},
    reducers: {
        logOut: (state, action) => {
            state.user = null
            state.accessToken = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            console.log(action.payload)
            state.accessToken = action.payload.token
            state.user = action.payload.user
            axios.defaults.headers.common['authorization'] = `Bearer ${state.accessToken}`
        })
    }
})

export const {logOut} = authSlice.actions
export default authSlice.reducer
export const selectCurrentToken = (state) => state.auth.accessToken
export const selectCurrentUser = (state) => state.auth?.user