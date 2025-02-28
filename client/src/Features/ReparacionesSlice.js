import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    reparaciones : [],
    usuarios : [],
    estadoreparaciones : "idle",
    estadousuarios : "idle",
    erroresreparaciones : null,
    erroresusuarios : null
}

const URL_BASE_REPARACIONES = process.env.REACT_APP_URI_API + '/reparaciones'

export const AgregarUsuario = createAsyncThunk ('Reparaciones/AgregarUsuario', async (usuario) => {
    try {
        const url = URL_BASE_REPARACIONES + '/registrarme'
        const response = await axios.post(url, usuario)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return error.message
    }
})

export const AgregarPresupuesto = createAsyncThunk('Reparaciones/AgregarPresupuesto', async (presupuesto) => {
    try {
        const url = URL_BASE_REPARACIONES + "/ingresar"
        const response = await axios.post(url, presupuesto)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

export const RecuperarUsuarios = createAsyncThunk('Reparaciones/RecuperarUsuarios', async ()=> {
    try {
        const url = URL_BASE_REPARACIONES + "/usuarios"
        const response = await axios.get(url)
        console.log(response)
        const result = {
            error : false,
            data : response.data
        }
        return result
    } catch (error) {
        const result = {
            error : true,
            message : error.message
        }
        console.error(error.message)
        return result
    }
})

export const RecuperarReparaciones = createAsyncThunk('Reparaciones/RecuperarReparaciones', async(iduser) => {
    try {
        const url = `${URL_BASE_REPARACIONES}/misreparaciones/${iduser}`
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const ReparacionesSlice = createSlice({
    name : 'reparaciones',
    initialState,
    reducers : {
        reinicializar : (state, action) => {
            return initialState
        }
    },
    extraReducers : (builder) => { builder
        .addCase(AgregarUsuario.fulfilled, (state, action) => {
            state.estadoreparaciones = "completed"
            state.reparaciones.push(action.payload)
        })
        .addCase(RecuperarReparaciones.fulfilled, (state, action) => {
            state.estadoreparaciones = "completed"
            if (!action.payload.error) {
                state.reparaciones = action.payload.data
            } else {
                state.erroresreparaciones = action.payload.message
            }
        })
        .addCase(RecuperarUsuarios.fulfilled, (state, action) => {
            state.estadousuarios = "completed"
            if (!action.payload.error) {
                state.usuarios = action.payload.data
            } else {
                state.erroresusuarios = action.payload.message
            }
        })
    }
})

export default ReparacionesSlice.reducer
export const {reinicializar} = ReparacionesSlice.actions

export const SeleccionarTodasLasReparaciones = (state) => {
    return state.reparaciones.reparaciones
}

export const SeleccionarTodosLosUsuarios = (state) => {
    return state.reparaciones.usuarios
}

export const EstadoReparaciones = (state) => state.reparaciones.estadoreparaciones
export const EstadoUsuarios = (state) => state.reparaciones.estadousuarios

export const ErroresReparaciones = (state) => state.reparaciones.erroresreparaciones
export const ErroresUsuarios = (state) => state.reparaciones.erroresusuarios