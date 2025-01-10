import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import ReturnError from './ReturnError'

console.log("llega a ventaSlice")

const initialState = {
    ventas : [],
    clientes: [],
    estadoventas : "idle",
    estadoclientes: "idle",
    erroresventa : null,
    errorescliente: null
}

const URL_BASE_CLIENTES = process.env.REACT_APP_URI_API_VENTAS + "/clientes"
const URL_BASE_VENTAS = process.env.REACT_APP_URI_API_VENTAS


export const AgregarCliente = createAsyncThunk('venta/AgregarCliente', async (cliente) => {
    try {
        const response = await axios.post(URL_BASE_CLIENTES, cliente)
        console.log(response.data)
        return response.data
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.log(console.error(error))
        return result
    }
})

export const ModificarCliente = createAsyncThunk('venta/ModificarCliente', async(cliente) => {
    try {
        console.log(cliente)
        const url = `${URL_BASE_CLIENTES}/${cliente.id}`
        console.log(url)
        const response = await axios.patch(url, cliente)
        console.log(response.data)
        return response.data
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.log(console.error(error))
        return result
    }
})

export const EliminarCliente = createAsyncThunk('venta/EliminarCliente', async (_id)=> {
    try {
        const url = `${URL_BASE_CLIENTES}/${_id}`
        console.log(url)
        //const response = await axios.delete(URL_BASE_CLIENTES + _id)
        const response = await axios.delete(url)
        console.log(response.data)
        return response.data
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.log(console.error(error))
        return result
    }
})

export const RecuperarClientes = createAsyncThunk ("venta/RecuperarClientes", async () => {
    try {
        console.log("llega al thunk recuperar clientes")
        const response = await axios.get(URL_BASE_CLIENTES)
        const result = {error: false, data : response.data}
        console.log(response)
        return result
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.log(console.error(error))
        return result
    }
})

export const AgregarVenta = createAsyncThunk('venta/AgregarVenta', async (venta) => {
    try {
        const response = await axios.post(URL_BASE_VENTAS, venta)
        console.log(response)
        return response.data
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.log(console.error(error))
        return result
    }
})

export const RecuperarVentas = createAsyncThunk ("venta/RecuperarVentas", async () => {
    try {
        console.log("llega al thunk recuperar ventas")
        console.log(URL_BASE_VENTAS)
        const response = await axios.get(URL_BASE_VENTAS)
        const result = {error: false, data : response.data}
        console.log(response)
        console.log("arriba respondio el thunk recuperar ventas")
        return result
    } catch (error) {
        const result = {
            error: true, 
            message: ReturnError(error)
        }
        console.log(console.error(error))
        return result
    }
})

export const RecuperarVenta = createAsyncThunk("venta/RecuperarVenta", async (id) => {
    try {
        const url = `${URL_BASE_VENTAS}/venta/` + id
        console.log(url)
        const response = await axios.get(url)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
        console.log(console.error(error))
        return result
    }
})

export const RecuperarCliente = createAsyncThunk("venta/RecuperarCliente", async (id) => {
    try {
        const url = `${URL_BASE_CLIENTES}/${id}`
        console.log(url)
        const response = await axios.get(url)
        const result = {error: false, data : response}
        console.log(result)
        return result.data.data.message
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
        console.log(console.error(error))
        return result
    }
})

export const VentaSlice = createSlice({
    name: "Venta",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{ builder
        .addCase(RecuperarClientes.fulfilled, (state, action) => {
            console.log("entra al extrarreducer 'recuperar clientes'")
            state.estadoclientes = "completed"
            if (!action.payload.error) {
                state.clientes = action.payload.data
            } else {
                state.errorescliente = action.payload.message
            }
        })
        .addCase(RecuperarVentas.fulfilled, (state, action) => {
            state.estadoventas = "completed"
            if (!action.payload.error) {
                state.ventas = action.payload.data
            } else {
                state.erroresventa = action.payload.message
            }
        })
        .addCase(AgregarVenta.fulfilled, (state, action) => {
            state.estadoventas = "completed"
            state.ventas.push(action.payload)
        })
        .addCase(AgregarCliente.fulfilled, (state, action) => {
            state.estadoclientes = "completed"
            state.clientes.push(action.payload)
        })
        .addCase(ModificarCliente.fulfilled, (state, action) => {
            state.clientes = state.clientes.map(item => {
                if (item._id === action.payload._id){
                    return action.payload
                } else {
                    return item
                }
            })
        })
        .addCase(EliminarCliente.fulfilled, (state, action) => {
            state.clientes = state.clientes.filter( (elem)=> {
                return elem._id !== action.payload._id
            })
        })
    }
})

export default VentaSlice.reducer

export const SeleccionarTodosLosClientes = (state) => {
    console.log(state)
    return state.ventas.clientes
}

export const SeleccionarTodasLasVentas = (state) => {
    console.log(state) 
    return state.ventas.ventas
}

export const EstadoVentas = (state) => state.ventas.estadoventas
export const Estadoclientes = (state) => state.ventas.estadoclientes

export const ErroresClientes = (state) => state.ventas.errorescliente
export const ErroresVentas = (state) => state.ventas.erroresventa