import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    proveedores:[],
    status: "idle",
    error: null
}

const URL_BASE_OC = process.env.REACT_APP_URI_API + `/ordenesdecompra/`
const URL_BASE_PROVEEDORES = process.env.REACT_APP_URI_API + `/proveedores/`
console.log(URL_BASE_PROVEEDORES)
const URL_BASE_MARCAS = process.env.REACT_APP_URI_API + `/marcas/`
const URL_BASE_PRODUCTOS = process.env.REACT_APP_URI_API + `/productos/`
const URL_BASE_LINEASCOMPRA = process.env.REACT_APP_URI_API + `/lineascompra/`
const URL_BASE_CATEGORIAS = process.env.REACT_APP_URI_API + `/categorias/`

export const RecuperarOrdenesDeCompra = createAsyncThunk ('ordenCompra/RecuperarOrdenesDeCompra', async ()=> {
    try {
        const response = await axios.get(URL_BASE_OC)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const RecuperarProveedores = createAsyncThunk ('ordenCompra/RecuperarProveedores', async () => {
    try {
        const response = await axios.get(URL_BASE_PROVEEDORES)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const RecuperarMarcas = createAsyncThunk ('ordenCompra/RecuperarMarcas', async () => {
    try {
        const response = await axios.get(URL_BASE_MARCAS)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const OrdenCompraSlice = createSlice({
    name: 'ordenCompra',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{ builder
        .addCase(RecuperarProveedores.fulfilled, (state, action) => {
            console.log('state')
            console.log(state)
            console.log('end state')
            state.status = "completed"
            state.proveedores = action.payload
        })
    }
})

export default OrdenCompraSlice.reducer

export const SeleccionarTodosLosProveedores = (state) => { console.log(state); return state.ordenesDeCompra.proveedores}
export const EstadoProveedores = (state) => state.ordenesDeCompra.status
export const ErroresProveedores = (state) => state.ordenesDeCompra.error