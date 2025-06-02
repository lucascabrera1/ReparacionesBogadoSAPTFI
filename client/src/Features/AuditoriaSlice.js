import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import ReturnError from './ReturnError'

const initialState = {
    auditorias : [],
    estadoauditorias : "idle",
    erroresauditorias : ""
}

const URL_BASE_AUDITORIA = process.env.REACT_APP_URI_API_AUDITORIA

export const AgregarAuditoriaLogout = createAsyncThunk('/auditoria/AgregarAuditoriaLogout', async (newaud) => {
    try {
        console.log("entra a agregar auditoria log out")
        const url = URL_BASE_AUDITORIA + "/loginlogout"
        console.log(url)
        console.log(newaud)
        const result = await axios.post(url, newaud)
        console.log(result)
        return result.data
    } catch (error) {
        console.error(error)
        return error.message
    }
})

export const AuditoriaSlice = createSlice({
    name : "Auditoria",
    initialState,
    reducers: {
        reinicializar : (state, action) => {
            return initialState
        }
    },
    extraReducers : (builder) => { builder
        .addCase(AgregarAuditoriaLogout.fulfilled, (state, action) => {
            state.estadoauditorias = "idle"
            state.auditorias.push(action.payload)
        })
    }
})

export default AuditoriaSlice.reducer
export const {reinicializar} = AuditoriaSlice.actions

export const SeleccionarTodasLasAuditorias = (state) => {
    return state.auditorias.auditorias
}

export const EstadoAuditorias = (state) => state.auditorias.estadoauditorias

export const ErroresAuditorias = (state) => state.auditorias.erroresauditorias