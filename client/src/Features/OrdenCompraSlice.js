import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    proveedores:[],
    marcas: [],
    productos: [],
    categorias: [],
    lineasCompra: [],
    ordenes: [],
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

/* const ErrorRetornado = (error) => {
    if (error === 403) return "Error 403: el servidor ha recibido y ha entendido la petición, pero rechaza enviar una respuesta"
    else if (error === 401) return "Error 401: carece de credenciales válidas de autenticación para el recurso solicitado"
} */

const ErrorRetornado = (error) => {
    let errorrecibido = error.response.status
    return errorrecibido === 403 ?  `Error 403: Acceso no autorizado ${error.response.data.message}` :
    errorrecibido === 401 ? `Error 401 : La soliocitud ha sido rechazada ${error.response.data.message}` :
    errorrecibido === 404 ? `Error 404: Recurso no encontrado ${error.response.data.message}`
    : error.message 
}

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
        console.log("entra al recuperar todas las ordenes de compra del slice")
        const response = await axios.get(URL_BASE_OC)
        const result = {error: false, data : response.data}
        console.log(result)
        return result
    } catch (error) {
        const result = {
            error: true, 
            //message: error.response.status===401?"Error 401: No Autorizado":error.message
            message: ErrorRetornado(error)
        }
        console.error(error)
        return result
    }
})

export const RecuperarProveedores = createAsyncThunk ('ordenCompra/RecuperarProveedores', async () => {
    try {
        const response = await axios.get(URL_BASE_PROVEEDORES)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {
            error: true, 
            //message: error.response.status===403?"Error 403, recurso no encontrado":error.message
            message: ErrorRetornado(error)
        }
        console.error(error)
        return result
    }
})

export const RecuperarCategorias = createAsyncThunk ('ordenCompra/RecuperarCategorias', async () => {
    try {
        const response = await axios.get(URL_BASE_CATEGORIAS)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error.message}
        console.log(console.error(error))
        return result
    }
})

export const RecuperarMarcas = createAsyncThunk ("ordenCompra/RecuperarMarcas", async () => {
    try {
        const response = await axios.get(URL_BASE_MARCAS)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {
            error: true, 
            //message: error.response.status===403?"Error 403 recurso no encontrado":error.message
            message: ErrorRetornado(error)
        }
        console.error(error)
        return result
    }
})

export const RecuperarProductos = createAsyncThunk ("ordenCompra/RecuperarProductos", async () => {
    try {
        console.log("llama al recuperar productos del slice")
        const response = await axios.get(URL_BASE_PRODUCTOS)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {
            error: true, 
            message: ErrorRetornado(error)
        }
        console.log(console.error(error))
        return result
    }
})

export const RecuperarProductosPorProveedor = createAsyncThunk ("ordenCompra/RecuperarProductosPorProveedor", async (idProveedor) => {
    try {
        console.log(idProveedor)
        if (idProveedor === "") return []
        const response = await axios.get(URL_BASE_PRODUCTOS + idProveedor)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ErrorRetornado(error)}
        console.log(console.error(error))
        return result
    }
})

export const RecuperarOrdenDeCompra = createAsyncThunk("ordenCompra/RecuperarOrdenDeCompra", async (id) => {
    try {
        console.log(URL_BASE_OC + id)
        const response = await axios.get(URL_BASE_OC + id)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error.message}
        console.log(console.error(error))
        return result
    }
})

export const RecuperarFormasDePago = createAsyncThunk ("ordenCompra/RecuperarFormasDePago", async () => {
    try {
        const response = await axios.get(URL_BASE_FORMASDEPAGO)
        const result = {error: false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error.message}
        console.log(console.error(error))
        return result
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
    reducers: {
        reinicializar : (state, action) => {
            return initialState
        }
    },
    extraReducers: (builder) =>{ builder
        .addCase(RecuperarProveedores.fulfilled, (state, action) => {
            //state.status = "completed"
            state.estadoproveedores = "completed"
            if (!action.payload.error) {
                state.proveedores = action.payload.data
            } else {
                state.errorproveedor = action.payload.message
            }
        })
        .addCase(RecuperarMarcas.fulfilled, (state, action) => {
            state.estadomarcas = "completed"
            if (!action.payload.error) {
                state.marcas = action.payload.data
            } else {
                state.errormarca = action.payload.message
            }
        })
        .addCase(RecuperarCategorias.fulfilled, (state, action) => {
            state.estadocategorias = "completed"
            if (!action.payload.error) {
                state.categorias = action.payload.data
            } else {
                state.errorcategoria = action.payload.message
            }
        })
        .addCase(RecuperarProductos.fulfilled, (state, action) => {
            state.estadoproductos = "completed"
            if (!action.payload.error) {
                state.productos = action.payload.data
            } else {
                state.errorproducto = action.payload.message
            }
        })
        .addCase(RecuperarFormasDePago.fulfilled, (state, action) => {
            state.estadoformasdepago = "completed"
            if (!action.payload.error) {
                state.formasdepago = action.payload.data
            } else {
                state.errorformadepago = action.payload.message
            }
        })
        .addCase(RecuperarOrdenesDeCompra.fulfilled, (state, action) => {
            state.estadoordenesdecompra = "completed"
            if (!action.payload.error) {
                state.ordenes = action.payload.data
            } else {
                state.errorordendencompra = action.payload.message
            }
        })
        .addCase(RecuperarOrdenDeCompra.fulfilled, (state, action) => {
            state.estadoordenesdecompra = "completed"
            state.ordenes = state.ordenes.map(item => {
                if (item._id === action.payload._id) {
                    return action.payload
                } else {
                    return item
                }
            })
        })
        .addCase(RecuperarProductosPorProveedor.fulfilled, (state, action) => {
            state.estadoproductos = "completed"
            if (!action.payload.error) {
                state.productos = action.payload.data
            } else {
                state.errorproducto = action.payload.message
            }
        })
        .addCase(AgregarMarca.fulfilled, (state, action) => {
            state.estadomarcas = "completed"
            state.marcas.push(action.payload)
        })
        .addCase(AgregarProveedor.fulfilled, (state, action) => {
            state.estadoproveedores = "completed"
            state.proveedores.push(action.payload)
        })
        .addCase(AgregarProducto.fulfilled, (state, action) => {
            state.estadoproductos = "completed"
            state.productos.push(action.payload)
        })
        .addCase(AgregarOrdenDeCompra.fulfilled, (state, action) => {
            console.log(action)
            console.log(state.ordenes)
            state.estadoordenesdecompra = "idle"
            state.estadoproductos = "idle"
            //state.ordenes.push(action.payload)
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
export const {reinicializar} = OrdenCompraSlice.actions

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
    console.log(state.ordenesDeCompra.ordenes)
    console.log(state.auth)
    return state.ordenesDeCompra.ordenes
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