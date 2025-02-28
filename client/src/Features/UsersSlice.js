import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'
import ReturnError from "./ReturnError";

const initialState = {
    usuarios : [],
    estadousuarios : "idle",
    erroresusuario : null
}

const urlApi = process.env.REACT_APP_URI_API

export const AgregarUsuario = createAsyncThunk('users/AgregarUsuario', async (user) => {
    try {
        const url = `${urlApi}/auth/signup`
        const response = await axios.post(url, user)
        console.log(response.data)
        return response.data
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.error(error)
        return result
    }
})

export const ModificarUsuario = createAsyncThunk('users/ModificarUsuario', async(initialUsuario) => {
    try {
        const url = `${urlApi}/auth/users/${initialUsuario.id}`
        console.log(url)
        const response = await axios.patch(url, initialUsuario)
        return response.data
    } catch (error) {
        console.error(error)
        return error.message
    }
})

export const RecuperarUsuarios = createAsyncThunk ('users/RecuperarUsuarios', async () => {
    try {
        const response = await axios.get(`${urlApi}/auth/users`)
        console.log(urlApi)
        console.log(response.data)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        console.log("ocurrio un error en recuperar usuarios slice")
        const result = {
            error: true,
            message: ReturnError(error)
        }
        console.error(error)
        return result
    }
})

export const EliminarUsuario = createAsyncThunk ('users/EliminarUsuario', async (_id) => {
    try {
        const url = `${urlApi}/auth/users/${_id}`
        console.log(url)
        const response = await axios.delete(url)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

export const FetchUser = createAsyncThunk('users/fetchUser', async (_id)=> {
    try {
        const response = await axios.get(`${urlApi}/auth/users/` + _id)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
        return error.message
    }
})

export const usersSlice = createSlice ({
    name: 'users',
    initialState,
    reducers: {
        reinicializar : (state, action) => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(AgregarUsuario.fulfilled, (state, action) => {
            console.log("entra al agregar usuario extrareducer ")
            console.log(action)
            state.estadousuarios = "idle"
            state.usuarios.push(action.payload)
        })
        .addCase(RecuperarUsuarios.fulfilled, (state, action) => {
            console.log("entra al extrarreducer recuperar usuarios")
            console.log(state)
            console.log(action)
            state.estadousuarios = "completed"
            if (!action.payload.error) {
                state.usuarios = action.payload.data
            } else {
                state.erroresusuario = action.payload.message
            }
        })
        .addCase(ModificarUsuario.fulfilled, (state, action) => {
            state.usuarios = state.usuarios.map(item => {
                if (item._id === action.payload._id){
                    return action.payload
                    //state.usuarios.push(action.payload)
                } else {
                    return item
                }
            })
        })
        .addCase(FetchUser.fulfilled, (state, action) => {
            state.usuarios = state.usuarios.map(item => {
                if (item._id === action.payload._id) {
                    return action.payload
                } else {
                    return item
                }
            })
        })
        .addCase(EliminarUsuario.fulfilled, (state, action) => {
            state.usuarios = state.usuarios.filter( (elem)=> {
                return elem._id !== action.payload._id
            })
        })
    }
})

export default usersSlice.reducer

export const {reinicializar} = usersSlice.actions

export const SeleccionarTodosLosUsuarios = (state) => {
    console.log(state)
    return state.users.usuarios
}

export const EstadoUsuarios = (state) => state.users.estadousuarios

export const ErroresUsuarios = (state) => {
    return state.users.erroresusuario
}