import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    remitos:[],
    productos: [],
    lineasCompra: [],
    lineasremito: [],
    ordenesDeCompra: [],
    formasdepago: [],
    estadoremitos: "idle",
    estadoproductos: "idle",
    estadolineascompra: "idle",
    estadoordenesdecompra: "idle",
    estadoformasdepago: "idle",
    estadolineasremito: "idle",
    errorremito: null,
    errorlineacompra: null,
    errorlinearemito: null,
    errorproducto: null,
    errorordendecompra: null,
    errorformadepago: null
}

const URL_BASE_OC = process.env.REACT_APP_URI_API + `/ordenesdecompra/`
const URL_BASE_LINEASCOMPRA = process.env.REACT_APP_URI_API_REMITOS + `/lineascompra/`
//const URL_BASE_PRODUCTOS = process.env.REACT_APP_URI_API_REMITOS + `/productos/`
const URL_BASE_REMITOS = process.env.REACT_APP_URI_API_REMITOS
//const URL_BASE_REMITOS = '127.0.0.1:4500/remitos/todos'


console.log(URL_BASE_REMITOS)

export const RecuperarRemitos = createAsyncThunk ('Remito/RecuperarRemitos', async ()=> {
    try {
        const response = await axios.get(`${URL_BASE_REMITOS}/todos`)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})


export const RecuperarOrdenesDeCompra = createAsyncThunk ('Remito/RecuperarOrdenesDeCompra', async ()=> {
    try {
        console.log('llega a la linea 61')
        console.log(URL_BASE_OC)
        const response = await axios.get(`${URL_BASE_REMITOS}/inicio`)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const RecuperarLineasDeCompra = createAsyncThunk ("Remito/RecuperarLineasDeCompra", async (idOc) => {
    try {
        console.log(idOc)
        console.log(URL_BASE_LINEASCOMPRA + idOc)
        const response = await axios.get(URL_BASE_LINEASCOMPRA + idOc)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
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
    reducers: {},
    extraReducers: (builder) =>{ builder
        .addCase(RecuperarRemitos.fulfilled, (state, action) => {
            state.status = "completed"
            state.remitos = action.payload
        })
        .addCase(RecuperarOrdenesDeCompra.fulfilled, (state, action) => {
            state.status = "completed"
            state.ordenesDeCompra = action.payload
        })
        .addCase(RecuperarLineasDeCompra.fulfilled, (state, action) => {
            state.status = "completed"
            state.lineasCompra = action.payload
        })
        .addCase(AgregarRemito.fulfilled, (state, action) => {
            state.status = "completed"
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

export const EstadoRemitos = (state) => state.remitos.estadoremitos
export const EstadoOrdenesDeCompra = (state) => state.remitos.estadoordenesdecompra
export const EstadoLineasDeCompra = (state) => state.remitos.estadolineascompra

export const ErroresRemitos = (state) => state.remitos.errorremito
export const ErroresOrdenesDeCompra = (state) => state.remitos.errorordendecompra
export const ErroresLineasDeCompra = (state) => state.remitos.errorordencompra