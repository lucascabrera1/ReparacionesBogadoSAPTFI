import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    proveedores:[],
    marcas: [],
    productos: [],
    categorias: [],
    lineasCompra: [],
    ordenesDeCompra: [],
    estadoproveedores: "idle",
    estadomarcas: "idle",
    estadoproductos: "idle",
    estadolineascompra: "idle",
    estadocategorias: "idle",
    estadoordenesdecompra: "idle",
    errorproveedor: null,
    errorlineacompra: null,
    errorcategoria: null,
    errormarca: null,
    errorproducto: null,
    errorordendencompra: null
}

const URL_BASE_OC = process.env.REACT_APP_URI_API + `/ordenesdecompra/`
const URL_BASE_PROVEEDORES = process.env.REACT_APP_URI_API + `/proveedores/`
console.log('url proveedores: ' + URL_BASE_PROVEEDORES)
const URL_BASE_MARCAS = process.env.REACT_APP_URI_API + `/marcas/`
const URL_BASE_PRODUCTOS = process.env.REACT_APP_URI_API + `/productos/`
const URL_BASE_LINEASCOMPRA = process.env.REACT_APP_URI_API + `/lineascompra/`
const URL_BASE_CATEGORIAS = process.env.REACT_APP_URI_API + `/categorias/`

export const AgregarMarca = createAsyncThunk('ordenCompra/AgregarMarca', async (marcaInicial) => {
    try {
        console.log('entra al guardar marca')
        console.log(marcaInicial)
        const response = await axios.post(URL_BASE_MARCAS, marcaInicial)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

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

export const RecuperarMarcas = createAsyncThunk ("ordenCompra/RecuperarMarcas", async () => {
    try {
        const response = await axios.get(URL_BASE_MARCAS)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const OrdenCompraSlice = createSlice({
    name: "ordenCompra",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{ builder
        .addCase(RecuperarProveedores.fulfilled, (state, action) => {
            console.log("state")
            console.log(state.ordenesDeCompra)
            console.log("end state")
            state.status = "completed"
            state.proveedores = action.payload
        })
        .addCase(RecuperarMarcas.fulfilled, (state, action) => {
            console.log("state")
            console.log(state.marcas)
            console.log("end state")
            state.status = "completed"
            state.marcas = action.payload
        })
        .addCase(AgregarMarca.fulfilled, (state, action) => {
            state.status = "completed"
            state.ordenesDeCompra.marcas.push(action.payload)
            console.log("state")
            console.log(state.marcas)
            console.log("end state")
        })
    }
})

export default OrdenCompraSlice.reducer

export const SeleccionarTodosLosProveedores = (state) => { 
    console.log(state) 
    return state.ordenesDeCompra.proveedores
}

export const SeleccionarTodasLasMarcas = (state) => { 
    console.log(state.ordenesDeCompra.marcas)
    console.log(state.ordenesDeCompra)
    console.log(state)
    return state.ordenesDeCompra.marcas
}

export const SeleccionarTodasLasCategorias = (state) => {
    console.log(state.ordenesDeCompra.categorias)
    return state.ordenesDeCompra.categorias
}

export const SeleccionarTodosLosProductos = (state) => { 
    console.log(state) 
    return state.ordenesDeCompra.productos
}

export const SeleccionarTodasLasLineasCompra = (state) => { 
    console.log(state.ordenesDeCompra.lineasCompra)
    return state.ordenesDeCompra.lineasCompra
}

export const SeleccionarTodasLasOrdenesDeCompra = (state) => {
    console.log(state.ordenesDeCompra.ordenesDeCompra)
    return state.ordenesDeCompra.ordenesDeCompra
}

export const EstadoProveedores = (state) => state.ordenesDeCompra.estadoproveedores
export const EstadoMarcas = (state) => state.ordenesDeCompra.estadomarcas
export const EstadoCategorias = (state) => state.ordenesDeCompra.estadocategorias
export const EstadoProductos = (state) => state.ordenesDeCompra.estadoproductos
export const EstadoLineasCompra = (state) => state.ordenesDeCompra.estadolineascompra
export const EstadoOrdenesDeCompra = (state) => state.ordenesDeCompra.estadoordenesdecompra

export const ErroresProveedores = (state) => state.ordenesDeCompra.errorproveedor
export const ErroresMarcas = (state) => state.ordenesDeCompra.errormarca
export const ErroresCategorias = (state) => state.ordenesDeCompra.errorcategoria
export const ErroresProductos = (state) => state.ordenesDeCompra.errorproducto
export const ErroresLineasCompra = (state) => state.ordenesDeCompra.errorlineacompra
export const ErroresOrdenesDeCompra = (state) => state.ordenesDeCompra.errorordendencompra