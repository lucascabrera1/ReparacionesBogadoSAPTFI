import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'

const urlApi = process.env.REACT_APP_URI_API
console.log(urlApi)

export const login = createAsyncThunk('auth/signin', async ({email, password}) => {
    console.log(urlApi)
    const url = `${urlApi}/auth/signin`
    console.log(url)
    const user = {
        email: email,
        password: password
    }
    console.log('llega al AuthSlice y muestra el usuario')
    console.log(user)
    console.log("usuario obtenido")
    try {
        const response = await axios.post(url, user)
        console.log("inicio response.data del auth slice")
        console.log(response.data)
        console.log("fin response.data del auth slice")
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
        accessToken: null
    },
    reducers: {
        logOut: (state, action) => {
            state.user = null
            state.accessToken = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            console.log("action.payload, aqui abajo deberia ver el token")
            console.log(action.payload)
            state.accessToken = action.payload.token
            state.user = action.payload.user
            axios.defaults.headers.common.Authorization = `Bearer ${state.accessToken}`
            console.log(axios.defaults.headers.common.Authorization)
            console.log(state.accessToken)
            console.log(state.user)
        })
    }
})

export const {logOut} = authSlice.actions
export default authSlice.reducer
export const selectCurrentToken = (state) =>  state.auth?.accessToken
export const selectCurrentUser = (state) => state.auth?.user