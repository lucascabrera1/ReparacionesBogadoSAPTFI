import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'
import ReturnError from "./ReturnError";

const urlApi = process.env.REACT_APP_URI_API
console.log(urlApi)

const initialState = {
    usuarios : [],
    estadousuarios : "idle",
    erroresusuario : null
}

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

export const AgregarUsuario = createAsyncThunk('auth/AgregarUsuario', async (user) => {
    try {
        const url = `${urlApi}/auth/signup`
        const response = await axios.post(url, user)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.error(error)
        return result
    }
})

export const ModificarUsuario = createAsyncThunk('auth/ModificarUsuario', async(initialUsuario) => {
    try {
        const url = `${urlApi}/auth/modificarusuario`
        const response = await axios.patch(url + initialUsuario.id, initialUsuario)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
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
            axios.defaults.headers.common.Authorization = ""
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
        .addCase(AgregarUsuario.fulfilled, (state, action) => {
            state.estadousuarios = "completed"
            console.log(action)
            if (!action.payload.error) {
                state.usuarios.push(action.meta.arg)
            } else {
                state.erroresusuario = action.payload.message
            }
        })
    }
})

export const {logOut} = authSlice.actions
export default authSlice.reducer
export const selectCurrentToken = (state) =>  state.auth?.accessToken
export const selectCurrentUser = (state) => state.auth?.user

export const SeleccionarTodosLosUsuarios = (state) => {
    return state.auth.usuarios
}

export const EstadoUsuarios = (state) => state.auth.estadousuarios

export const ErroresUsuarios = (state) => {
    console.log(state.auth)
    return state.auth.erroresusuario
}