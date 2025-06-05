import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import ReturnError from './ReturnError'

const initialState = {
    auditoriaspresupuesto : [],
    auditoriasloginlogout : [],
    estadoauditoriaspresupuesto : "idle",
    estadoauditoriasloginlogout : "idle",
    erroresauditoriaspresupuesto : "",
    erroresauditoriasloginlogout : ""
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

export const RecuperarAuditoriasLoginLogout = createAsyncThunk('/auditoria/RecuperarAuditoriaLoginLogout', async (newaud) => {
    try {
        console.log("entra a recuperar auditoria login logout")
        const url = URL_BASE_AUDITORIA + "/loginlogout"
        const result = await axios.get(url)
        console.log(result)
        let resp = {
            error: false,
            data: result.data
        }
        return resp
    } catch (error) {
        const result = {
            error: true, 
            //message: error.response.status===401?"Error 401: No Autorizado":error.message
            message: ReturnError(error)
        }
        console.error(error)
        return result
    }
})

export const RecuperarAuditoriasPresupuesto = createAsyncThunk('/auditoria/RecuperarAuditoriasPresupuesto', async (newaud) => {
    try {
        console.log("entra a recuperar auditoria presupuesto")
        const url = URL_BASE_AUDITORIA + "/presupuestos"
        const result = await axios.get(url)
        console.log(result)
        let resp = {
            error: false,
            data: result.data
        }
        return resp
    } catch (error) {
        const result = {
            error: true, 
            //message: error.response.status===401?"Error 401: No Autorizado":error.message
            message: ReturnError(error)
        }
        console.error(error)
        return result
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
            state.estadoauditoriasloginlogout = "idle"
            state.auditoriasloginlogout.push(action.payload)
        })
        .addCase(RecuperarAuditoriasLoginLogout.fulfilled, (state, action) => {
            state.estadoauditoriasloginlogout = "completed"
            if (!action.payload.error) {
                state.auditoriasloginlogout = action.payload.data
            } else {
                state.erroresauditoriasloginlogout = action.payload.message
            }
        })
        .addCase(RecuperarAuditoriasPresupuesto.fulfilled, (state, action) => {
            state.estadoauditoriaspresupuesto = "completed"
            if (!action.payload.error) {
                state.auditoriaspresupuesto = action.payload.data
            } else {
                state.erroresauditoriaspresupuesto = action.payload.message
            }
        })
    }
})

export default AuditoriaSlice.reducer
export const {reinicializar} = AuditoriaSlice.actions

export const SeleccionarTodasLasAuditoriasLoginLogout = (state) => {
    return state.auditorias.auditoriasloginlogout
}
export const SeleccionarTodasLasAuditoriasPresupuesto = (state) => {
    return state.auditorias.auditoriaspresupuesto
}

export const EstadoAuditoriasLoginLogout = (state) => state.auditorias.estadoauditoriasloginlogout
export const EstadoAuditoriasPresupuesto = (state) => state.auditorias.estadoauditoriaspresupuesto

export const ErroresAuditoriasLoginLogout = (state) => state.auditorias.erroresauditoriasloginlogout
export const ErroresAuditoriasPresupuesto = (state) => state.auditorias.erroresauditoriaspresupuesto