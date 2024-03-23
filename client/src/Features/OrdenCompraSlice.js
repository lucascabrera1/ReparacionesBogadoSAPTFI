import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    proveedores:[],
    marcas: [],
    productos: [],
    categorias: [],
    lineasCompra: [],
    ordenesDeCompra: [],
    formasdepago: [],
    estadoproveedores: "idle",
    estadomarcas: "idle",
    estadoproductos: "idle",
    estadolineascompra: "idle",
    estadocategorias: "idle",
    estadoordenesdecompra: "idle",
    estadoformasdepago: "idle",
    errorproveedor: null,
    errorlineacompra: null,
    errorcategoria: null,
    errormarca: null,
    errorproducto: null,
    errorordendencompra: null,
    errorformadepago: null
}

const URL_BASE_OC = process.env.REACT_APP_URI_API + `/ordenesdecompra/`
const URL_BASE_PROVEEDORES = process.env.REACT_APP_URI_API + `/proveedores/`
const URL_BASE_MARCAS = process.env.REACT_APP_URI_API + `/marcas/`
const URL_BASE_PRODUCTOS = process.env.REACT_APP_URI_API + `/productos/`
const URL_BASE_LINEASCOMPRA = process.env.REACT_APP_URI_API + `/lineascompra/`
const URL_BASE_CATEGORIAS = process.env.REACT_APP_URI_API + `/categorias/`
const URL_BASE_FORMASDEPAGO = process.env.REACT_APP_URI_API + `/formasdepago`

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

export const AgregarProveedor = createAsyncThunk('/ordenCompra/AgregarProveedor', async (proveedorInicial) => {
    try {
        console.log('entra al guardar proveedor')
        console.log(proveedorInicial)
        const response = await axios.post(URL_BASE_PROVEEDORES, proveedorInicial)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

export const AgregarProducto = createAsyncThunk('/ordenCompra/AgregarProducto', async (productoInicial) => {
    try {
        console.log('entra al guardar proveedor')
        console.log(productoInicial)
        const response = await axios.post(URL_BASE_PRODUCTOS, productoInicial)
        console.log(response.data)
        let resp = {
            error: false,
            data: response.data
        }
        return resp
    } catch (error) {
        console.error(error.message)
        let resp = {
            error: true,
            message: error.response.data.message
        }
        return resp
    }
})

export const AgregarOrdenDeCompra = createAsyncThunk('/ordenCompra/AgregarOrdenDeCompra', async (ocInicial) => {
    try {
        console.log('entra al guardar orden de compra')
        console.log(ocInicial)
        const response = await axios.post(URL_BASE_OC, ocInicial)
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

export const RecuperarCategorias = createAsyncThunk ('ordenCompra/RecuperarCategorias', async () => {
    try {
        const response = await axios.get(URL_BASE_CATEGORIAS)
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

export const RecuperarProductos = createAsyncThunk ("ordenCompra/RecuperarProductos", async () => {
    try {
        const response = await axios.get(URL_BASE_PRODUCTOS)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const RecuperarProductosPorProveedor = createAsyncThunk ("ordenCompra/RecuperarProductosPorProveedor", async (idProveedor) => {
    try {
        console.log(idProveedor)
        if (idProveedor === "") return []
        const response = await axios.get(URL_BASE_PRODUCTOS + idProveedor)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const RecuperarOrdenDeCompra = createAsyncThunk("ordenCompra/RecuperarOrdenDeCompra", async (id) => {
    try {
        console.log(URL_BASE_OC + id)
        const response = await axios.get(URL_BASE_OC + id)
        return response.data
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const RecuperarFormasDePago = createAsyncThunk ("ordenCompra/RecuperarFormasDePago", async () => {
    try {
        const response = await axios.get(URL_BASE_FORMASDEPAGO)
        return [...response.data]
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const EliminarMarca = createAsyncThunk('ordenCompra/EliminarMarca', async (_id) => {
    try {
        const response = await axios.delete(URL_BASE_MARCAS + _id)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

export const EliminarProveedor = createAsyncThunk('ordenCompra/EliminarProveedor', async (_id)=> {
    try {
        const response = await axios.delete(URL_BASE_PROVEEDORES + _id)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const EliminarProducto = createAsyncThunk('ordenCompra/EliminarProducto', async (_id)=> {
    try {
        const response = await axios.delete(URL_BASE_PRODUCTOS + _id)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(console.error(error))
        return error.message
    }
})

export const ModificarProveedor = createAsyncThunk('ordenCompra/ModificarProveedor', async(initialProveedor) => {
    try {
        console.log(URL_BASE_PROVEEDORES + initialProveedor)
        console.log(initialProveedor.id)
        console.log(initialProveedor)
        const response = await axios.patch(URL_BASE_PROVEEDORES + initialProveedor.id, initialProveedor)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

export const ModificarProducto = createAsyncThunk('ordenCompra/ModificarProducto', async(initialProducto) => {
    try {
        console.log(URL_BASE_PRODUCTOS + initialProducto)
        console.log(initialProducto.id)
        console.log(initialProducto)
        const response = await axios.patch(URL_BASE_PRODUCTOS + initialProducto.id, initialProducto)
        return response.data
    } catch (error) {
        console.error(error.message)
        return error.message
    }
})

export const OrdenCompraSlice = createSlice({
    name: "ordenesDeCompra",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{ builder
        .addCase(RecuperarProveedores.fulfilled, (state, action) => {
            //state.status = "completed"
            state.estadoproveedores = "completed"
            state.proveedores = action.payload
        })
        .addCase(RecuperarMarcas.fulfilled, (state, action) => {
            state.status = "completed"
            state.marcas = action.payload
        })
        .addCase(RecuperarCategorias.fulfilled, (state, action) => {
            state.status = "completed"
            state.categorias = action.payload
        })
        .addCase(RecuperarProductos.fulfilled, (state, action) => {
            state.status = "completed"
            state.productos = action.payload
        })
        .addCase(RecuperarFormasDePago.fulfilled, (state, action) => {
            state.status = "completed"
            state.formasdepago = action.payload
        })
        .addCase(RecuperarOrdenesDeCompra.fulfilled, (state, action) => {
            state.status = "completed"
            state.ordenesDeCompra = action.payload
        })
        .addCase(RecuperarOrdenDeCompra.fulfilled, (state, action) => {
            state.ordenesDeCompra = state.ordenesDeCompra.map(item => {
                if (item._id === action.payload._id) {
                    return action.payload
                } else {
                    return item
                }
            })
        })
        .addCase(RecuperarProductosPorProveedor.fulfilled, (state, action) => {
            state.status = "completed"
            state.productos = action.payload
        })
        .addCase(AgregarMarca.fulfilled, (state, action) => {
            state.status = "completed"
            state.marcas.push(action.payload)
        })
        .addCase(AgregarProveedor.fulfilled, (state, action) => {
            state.status = "completed"
            state.proveedores.push(action.payload)
        })
        .addCase(AgregarProducto.fulfilled, (state, action) => {
            state.status = "completed"
            state.productos.push(action.payload)
        })
        .addCase(AgregarOrdenDeCompra.fulfilled, (state, action) => {
            state.status = "completed"
            state.ordenesDeCompra.push(action.payload)
        })
        .addCase(EliminarMarca.fulfilled, (state, action) => {
            state.marcas = state.marcas.filter( (elem)=> {
                return elem._id !== action.payload._id
            })
        })
        .addCase(EliminarProveedor.fulfilled, (state, action) => {
            state.proveedores = state.proveedores.filter((elem) => {
                return elem._id !== action.payload._id
            })
        })
        .addCase(EliminarProducto.fulfilled, (state, action) => {
            state.productos = state.productos.filter((elem) => {
                return elem._id !== action.payload._id
            })
        })
        .addCase(ModificarProveedor.fulfilled, (state, action) => {
            state.proveedores = state.proveedores.map(item => {
                if (item._id === action.payload._id){
                    return action.payload
                } else {
                    return item
                }
            })
        })
        .addCase(ModificarProducto.fulfilled, (state, action) => {
            state.productos = state.productos.map(item => {
                if (item._id === action.payload._id){
                    return action.payload
                } else {
                    return item
                }
            })
        })
    }
})

export default OrdenCompraSlice.reducer

export const SeleccionarTodosLosProveedores = (state) => { 
    return state.ordenesDeCompra.proveedores
}

export const SeleccionarTodasLasMarcas = (state) => { 
    console.log(state.ordenesDeCompra.marcas)
    console.log(state.ordenesDeCompra)
    console.log(state)
    return state.ordenesDeCompra.marcas
}

export const SeleccionarTodasLasCategorias = (state) => {
    return state.ordenesDeCompra.categorias
}

export const SeleccionarTodosLosProductos = (state) => {
    return state.ordenesDeCompra.productos
}

export const SeleccionarTodasLasLineasCompra = (state) => { 
    return state.ordenesDeCompra.lineasCompra
}

export const SeleccionarTodasLasOrdenesDeCompra = (state) => {
    return state.ordenesDeCompra.ordenesDeCompra
}

export const SeleccionarTodasLasFormasDePago = (state) => {
    return state.ordenesDeCompra.formasdepago
}

export const EstadoProveedores = (state) => {console.log(state);return state.ordenesDeCompra.estadoproveedores}
export const EstadoMarcas = (state) => state.ordenesDeCompra.estadomarcas
export const EstadoCategorias = (state) => state.ordenesDeCompra.estadocategorias
export const EstadoProductos = (state) => state.ordenesDeCompra.estadoproductos
export const EstadoLineasCompra = (state) => state.ordenesDeCompra.estadolineascompra
export const EstadoOrdenesDeCompra = (state) => state.ordenesDeCompra.estadoordenesdecompra
export const EstadoFormasDePago = (state) => state.ordenesDeCompra.estadoformasdepago

export const ErroresProveedores = (state) => state.ordenesDeCompra.errorproveedor
export const ErroresMarcas = (state) => state.ordenesDeCompra.errormarca
export const ErroresCategorias = (state) => state.ordenesDeCompra.errorcategoria
export const ErroresProductos = (state) => state.ordenesDeCompra.errorproducto
export const ErroresLineasCompra = (state) => state.ordenesDeCompra.errorlineacompra
export const ErroresOrdenesDeCompra = (state) => state.ordenesDeCompra.errorordendencompra
export const ErroresFormasDePago = (state) => state.ordenesDeCompra.errorformadepago