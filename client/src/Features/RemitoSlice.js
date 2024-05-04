import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import ErrorRetornado from './ReturnError'

const initialState = {
    remitos:[],
    productos: [],
    lineasCompra: [],
    lineasremito: [],
    ordenesDeCompra: [],
    formasdepago: [],
    proveedores : [],
    estadoremitos: "idle",
    estadoproductos: "idle",
    estadolineascompra: "idle",
    estadoordenesdecompra: "idle",
    estadoformasdepago: "idle",
    estadolineasremito: "idle",
    estadoproveedores : "idle",
    errorremito: null,
    errorlineacompra: null,
    errorlinearemito: null,
    errorproducto: null,
    errorordendecompra: null,
    errorformadepago: null,
    errorproveedor : null
}

/* const ErrorRetornado = (error) => {
    let errorrecibido = error.response.status
    return errorrecibido === 403 ?  `Error 403: Acceso no autorizado ${error.response.data.message}` :
    errorrecibido === 401 ? `Error 401 : La soliocitud ha sido rechazada ${error.response.data.message}` :
    errorrecibido === 404 ? `Error 404: Recurso no encontrado ${error.response.data.message}`
    : error.message 
} */

const URL_BASE_OC = process.env.REACT_APP_URI_API + `/ordenesdecompra/`
const URL_BASE_LINEASCOMPRA = process.env.REACT_APP_URI_API_REMITOS + `/lineascompra/`
//const URL_BASE_PRODUCTOS = process.env.REACT_APP_URI_API_REMITOS + `/productos/`
const URL_BASE_REMITOS = process.env.REACT_APP_URI_API_REMITOS
const URL_BASE_PROVEEDORES = process.env.REACT_APP_URI_API_REMITOS + `/proveedores`
//const URL_BASE_REMITOS = '127.0.0.1:4500/remitos/todos'

export const RecuperarProveedores = createAsyncThunk ('Remito/RecuperarProveedores', async () => {
    try {
        console.log("entra al recuperar proveedores")
        const response = await axios.get(URL_BASE_PROVEEDORES)
        const result = {error: false, data : response.data}
        console.log(response)
        return result
    } catch (error) {
        const result = {
            error: true, 
            message: ErrorRetornado(error)
        }
        console.error(error)
        return result
    }
})

export const RecuperarRemitos = createAsyncThunk ('Remito/RecuperarRemitos', async ()=> {
    try {
        console.log("llega al recuperar remitos")
        const response = await axios.get(`${URL_BASE_REMITOS}/todos`)
        console.log("a continuacion deberia ver la respuesta")
        console.log(response)
        console.log("fin respuesta")
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {
            error: true, 
            message: ErrorRetornado(error)
        }
        console.log(result)
        console.error(error)
        return result
    }
})


export const RecuperarOrdenesDeCompra = createAsyncThunk ('Remito/RecuperarOrdenesDeCompra', async ()=> {
    try {
        console.log(URL_BASE_REMITOS)
        const response = await axios.get(`${URL_BASE_REMITOS}/inicio`)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {
            error: true, 
            message: ErrorRetornado(error)
        }
        console.error(error)
        return result
    }
})

export const RecuperarLineasDeCompra = createAsyncThunk ("Remito/RecuperarLineasDeCompra", async (idOc) => {
    try {
        console.log(idOc)
        console.log(URL_BASE_LINEASCOMPRA + idOc)
        const response = await axios.get(URL_BASE_LINEASCOMPRA + idOc)
        console.log(response)
        return [...response.data]
    } catch (error) {
        console.error(error)
        return error.message
    }
})

export const RecuperarRemitoDeCompra = createAsyncThunk("Remito/RecuperarRemitoDeCompra", async (id) => {
    try {
        console.log(URL_BASE_REMITOS + id)
        const response = await axios.get(`${URL_BASE_REMITOS}/remito/${id}`)
        return response.data
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const AgregarRemito = createAsyncThunk('Remito/AgregarRemito', async(remito) => {
    try {
        console.log('entra al guardar remito')
        console.log(remito)
        const response = await axios.post(`${URL_BASE_REMITOS}/todos`, remito)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

export const RemitoSlice = createSlice({
    name: "Remito",
    initialState,
    reducers: {
        reinicializar : (state, action) => {
            return initialState
        }
    },
    extraReducers: (builder) =>{ builder
        .addCase(RecuperarRemitos.fulfilled, (state, action) => {
            state.estadoremitos = "completed"
            if (!action.payload.error) {
                state.remitos = action.payload.data
            } else {
                state.errorremito = action.payload.message
            }
        })
        /* .addCase(RecuperarRemitos.rejected, (state, action) => {
            state.estadoremitos = "completed"
            state.errorremito = action.payload.message
        }) */
        .addCase(RecuperarProveedores.fulfilled, (state, action) => {
            //state.status = "completed"
            state.estadoproveedores = "completed"
            if (!action.payload.error) {
                state.proveedores = action.payload.data
            } else {
                state.errorproveedor = action.payload.message
            }
        })
        .addCase(RecuperarOrdenesDeCompra.fulfilled, (state, action) => {
            state.estadoremitos = "completed"
            if (!action.payload.error) {
                state.ordenesDeCompra = action.payload.data
            } else {
                state.errorordendecompra = action.payload.message
            }
        })
        .addCase(RecuperarLineasDeCompra.fulfilled, (state, action) => {
            state.estadolineascompra = "completed"
            state.lineasCompra = action.payload
        })
        .addCase(AgregarRemito.fulfilled, (state, action) => {
            state.estadoremitos = "completed"
            state.remitos.push(action.payload)
        })
        .addCase(RecuperarRemitoDeCompra.fulfilled, (state, action) => {
            state.remitos = state.remitos.map(item => {
                if (item._id === action.payload._id) {
                    return action.payload
                } else {
                    return item
                }
            })
        })
    }
})

export default RemitoSlice.reducer
export const {reinicializar} = RemitoSlice.actions

export const SeleccionarTodosLosRemitos = (state) => {
    return state.remitos.remitos
}

export const SeleccionarTodasLasOrdenesDeCompra = (state) => { 
    return state.remitos.ordenesDeCompra
}

export const SeleccionarTodasLasLineasDeCompra = (state) => { 
    console.log(state.remitos.lineasCompra)
    return state.remitos.lineasCompra
}

export const SeleccionarTodosLosProveedores = (state) => { 
    return state.remitos.proveedores
}

export const EstadoRemitos = (state) => state.remitos.estadoremitos
export const EstadoOrdenesDeCompra = (state) => state.remitos.estadoordenesdecompra
export const EstadoLineasDeCompra = (state) => state.remitos.estadolineascompra
export const EstadoProveedores = (state) => {console.log(state);return state.remitos.estadoproveedores}

export const ErroresRemitos = (state) =>  {
    console.log(state.remitos.errorremito)
    return state.remitos.errorremito
}
export const ErroresOrdenesDeCompra = (state) => state.remitos.errorordendecompra
export const ErroresLineasDeCompra = (state) => state.remitos.errorordencompra
export const ErroresProveedores = (state) => state.remitos.errorproveedor