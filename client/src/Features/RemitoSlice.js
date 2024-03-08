import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    remitos:[],
    proveedores:[],
    productos: [],
    lineasCompra: [],
    lineasremito: [],
    ordenesDeCompra: [],
    formasdepago: [],
    estadoremitos: "idle",
    estadoproveedores: "idle",
    estadoproductos: "idle",
    estadolineascompra: "idle",
    estadoordenesdecompra: "idle",
    estadoformasdepago: "idle",
    estadolineasremito: "idle",
    errorremito: null,
    errorproveedor: null,
    errorlineacompra: null,
    errorlinearemito: null,
    errorproducto: null,
    errorordendecompra: null,
    errorformadepago: null
}

const URL_BASE_OC = process.env.REACT_APP_URI_API + `/ordenesdecompra/`
const URL_BASE_PROVEEDORES = process.env.REACT_APP_URI_API + `/proveedores`
const URL_BASE_LINEASCOMPRA = process.env.REACT_APP_URI_API_REMITOS + `/lineascompra/`
//const URL_BASE_PRODUCTOS = process.env.REACT_APP_URI_API_REMITOS + `/productos/`
const URL_BASE_REMITOS = process.env.REACT_APP_URI_API_REMITOS + `/todos`
//const URL_BASE_REMITOS = '127.0.0.1:4500/remitos/todos'


console.log(URL_BASE_REMITOS)

export const RecuperarRemitos = createAsyncThunk ('Remito/RecuperarRemitos', async ()=> {
    try {
        const response = await axios.get(URL_BASE_REMITOS)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const RecuperarProveedores = createAsyncThunk ('Remito/RecuperarProveedores', async () => {
    try {
        console.log(URL_BASE_PROVEEDORES)
        const response = await axios.get(URL_BASE_PROVEEDORES)
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
        const response = await axios.get(URL_BASE_OC)
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

export const AgregarRemito = createAsyncThunk('Remito/AgregarRemito', async(remito) => {
    try {
        console.log('entra al guardar remito')
        console.log(remito)
        const response = await axios.post(URL_BASE_REMITOS, remito)
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
        .addCase(RecuperarProveedores.fulfilled, (state, action) => {
            state.status = "completed"
            state.proveedores = action.payload
            console.log(state.proveedores)
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
    }
})

export default RemitoSlice.reducer

export const SeleccionarTodosLosRemitos = (state) => {
    return state.remitos.remitos
}

export const SeleccionarTodosLosProveedores = (state) => {
    return state.remitos.proveedores
}

export const SeleccionarTodasLasOrdenesDeCompra = (state) => { 
    return state.remitos.ordenesDeCompra
}

export const SeleccionarTodasLasLineasDeCompra = (state) => { 
    console.log(state.remitos.lineasCompra)
    return state.remitos.lineasCompra
}

export const EstadoRemitos = (state) => state.remitos.estadoremitos
export const EstadoProveedores = (state) => state.remitos.estadoproveedores
export const EstadoOrdenesDeCompra = (state) => state.remitos.estadoordenesdecompra
export const EstadoLineasDeCompra = (state) => state.remitos.estadolineascompra

export const ErroresRemitos = (state) => state.remitos.errorremito
export const ErroresProveedores = (state) => state.remitos.errorproveedor
export const ErroresOrdenesDeCompra = (state) => state.remitos.errorordendecompra
export const ErroresLineasDeCompra = (state) => state.remitos.errorordencompra