import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
//import { RecuperarModelos } from './OrdenCompraSlice'

const initialState = {
    reparaciones : [],
    usuarios : [],
    marcas : [],
    modelos : [],
    estadoreparaciones : "idle",
    estadousuarios : "idle",
    estadomarcas : "idle",
    estadomodelos : "idle",
    erroresreparaciones : null,
    erroresusuarios : null,
    erroresmarcas : null,
    erroresmodelos : null
}

const URL_BASE_REPARACIONES = process.env.REACT_APP_URI_API + '/reparaciones'

export const AgregarUsuario = createAsyncThunk ('Reparaciones/AgregarUsuario', async (usuario) => {
    try {
        const url = URL_BASE_REPARACIONES + '/registrarme'
        const response = await axios.post(url, usuario)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return error.message
    }
})

export const AgregarPresupuesto = createAsyncThunk('Reparaciones/AgregarPresupuesto', async (presupuesto) => {
    try {
        const url = URL_BASE_REPARACIONES + "/ingresar"
        const response = await axios.post(url, presupuesto)
        console.log("respuesta del slice en agregar presupuesto")
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return error.message
    }
})

export const RecuperarUsuarios = createAsyncThunk('Reparaciones/RecuperarUsuarios', async ()=> {
    try {
        const url = URL_BASE_REPARACIONES + "/usuarios"
        const response = await axios.get(url)
        console.log(response)
        const result = {
            error : false,
            data : response.data
        }
        return result
    } catch (error) {
        const result = {
            error : true,
            message : error.message
        }
        console.error(error.message)
        return result
    }
})

export const RecuperarReparaciones = createAsyncThunk('Reparaciones/RecuperarReparaciones', async(iduser) => {
    try {
        const url = `${URL_BASE_REPARACIONES}/misreparaciones/${iduser}`
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const RecuperarMarcas = createAsyncThunk('Reparaciones/RecuperarMarcas', async()=> {
    try {
        const url = URL_BASE_REPARACIONES + "/marcas"
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const RecuperarModelos = createAsyncThunk('Reparaciones/RecuperarModelos', async(idMarca)=> {
    try {
        const url = `${URL_BASE_REPARACIONES}/modelos/${idMarca}`
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const RecuperarPresupuestosIngresados = createAsyncThunk("Reparaciones/RecuperarPresupuestosIngresados", async() => {
    try {
        const url = URL_BASE_REPARACIONES + "/presupuestosingresados"
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const RecuperarPresupuestoIngresado = createAsyncThunk("Reparaciones/RecuperarPresupuestoIngresado", async(id) => {
    try {
        const url = URL_BASE_REPARACIONES + "/diagnosticar/" + id
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const DiagnosticarPresupuesto = createAsyncThunk("Reparaciones/DiagnosticarPresupuesto", async (pres) => {
    try {
        const url = URL_BASE_REPARACIONES + "/diagnosticar/" + pres.id
        console.log(pres)
        const response = await axios.patch(url, pres)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const ConfirmarPresupuesto = createAsyncThunk("Reparaciones/ConfirmarPresupuesto", async (pres) => {
    try {
        const url = URL_BASE_REPARACIONES + "/confirmar/" + pres._id
        console.log(url)
        const response = await axios.patch(url, pres)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const DescartarPresupuesto = createAsyncThunk("Reparaciones/DescartarPresupuesto", async (pres) => {
    try {
        const url = URL_BASE_REPARACIONES + "/descartar/" + pres._id
        console.log(pres)
        const response = await axios.patch(url, pres)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const RecuperarPresupuestosConfirmados = createAsyncThunk("Reparaciones/RecuperarPresupuestosConfirmados", async() => {
    try {
        const url = URL_BASE_REPARACIONES + "/presupuestosconfirmados"
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: error}
        console.error(error)
        return result
    }
})

export const ReparacionesSlice = createSlice({
    name : 'reparaciones',
    initialState,
    reducers : {
        reinicializar : (state, action) => {
            return initialState
        }
    },
    extraReducers : (builder) => { builder
        .addCase(AgregarUsuario.fulfilled, (state, action) => {
            state.estadoreparaciones = "idle"
            state.reparaciones.push(action.payload)
        })
        .addCase(AgregarPresupuesto.fulfilled, (state, action) => {
            state.estadoreparaciones = "idle"
            state.reparaciones.push(action.payload)
        })
        .addCase(RecuperarReparaciones.fulfilled, (state, action) => {
            state.estadoreparaciones = "completed"
            if (!action.payload.error) {
                state.reparaciones = action.payload.data
            } else {
                state.erroresreparaciones = action.payload.message
            }
        })
        .addCase(RecuperarUsuarios.fulfilled, (state, action) => {
            state.estadousuarios = "completed"
            if (!action.payload.error) {
                state.usuarios = action.payload.data
            } else {
                state.erroresusuarios = action.payload.message
            }
        })
        .addCase(RecuperarMarcas.fulfilled, (state, action) => {
            state.estadomarcas = "completed"
            if (!action.payload.error) {
                state.marcas = action.payload.data
            } else {
                state.erroresmarcas = action.payload.message
            }
        })
        .addCase(RecuperarModelos.fulfilled, (state, action) => {
            state.estadomodelos = "completed"
            if (!action.payload.error) {
                state.modelos = action.payload.data
            } else {
                state.erroresmodelos = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestosIngresados.fulfilled, (state, action) => {
            //state.estadoreparaciones = "completed"
            if (!action.payload.error) {
                state.reparaciones = action.payload.data
            } else {
                state.erroresreparaciones = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestosConfirmados.fulfilled, (state, action) => {
            //state.estadoreparaciones = "completed"
            if (!action.payload.error) {
                state.reparaciones = action.payload.data
            } else {
                state.erroresreparaciones = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestoIngresado.fulfilled, (state, action) => {
            //state.estadoreparaciones = "completed"
            if (!action.payload.error) {
                state.reparaciones = action.payload.data
                /* state.reparaciones = []
                state.reparaciones.push(action.payload.data) */
            } else {
                state.erroresreparaciones = action.payload.message
            }
        })
        .addCase(DiagnosticarPresupuesto.fulfilled, (state, action) => {
            state.estadoreparaciones = "idle"
            /* state.reparaciones = state.reparaciones.map(item => {
                if (item._id === action.payload._id) {
                    return action.payload.data
                } else {
                    return action.payload.message
                }
            }) */
           console.log(state)
           console.log(state.reparaciones.reparaciones)
            const index = state.reparaciones.findIndex(item => item.id === action.payload.data._id);
            if (index !== -1) {
                state.reparaciones[index] = action.payload.data; // Actualiza el elemento
            }
        })
        .addCase(ConfirmarPresupuesto.fulfilled, (state, action) => {
            /* state.reparaciones = state.reparaciones.map (item => {
                if (item._id === action.payload._id) {
                    return action.payload.data
                } else {
                    return action.payload.message
                }
            }) */
           state.estadoreparaciones = "idle"
           //state.reparaciones.push(action.payload.data)
           console.log(state.reparaciones)
           const index = state.reparaciones.findIndex(item => item.id === action.payload.data._id);
            if (index !== -1) {
                state.reparaciones[index] = action.payload.data; // Actualiza el elemento
            }
        })
        .addCase(DescartarPresupuesto.fulfilled, (state, action) => {
            /* state.reparaciones = state.reparaciones.map (item => {
                if (item._id === action.payload._id) {
                    return action.payload.data
                } else {
                    return action.payload.message
                }
            }) */
           state.estadoreparaciones = "idle"
           console.log(state.reparaciones)
            const index = state.reparaciones.findIndex(item => item.id === action.payload.data._id);
            if (index !== -1) {
                state.reparaciones[index] = action.payload.data; // Actualiza el elemento
            }
        })
    }
})

export default ReparacionesSlice.reducer
export const {reinicializar} = ReparacionesSlice.actions

export const SeleccionarTodasLasReparaciones = (state) => {
    return state.reparaciones.reparaciones
}

export const SeleccionarTodosLosUsuarios = (state) => {
    return state.reparaciones.usuarios
}

export const SeleccionarTodasLasMarcas = (state) => {
    return state.reparaciones.marcas
}


export const SeleccionarModelos = (state) => {
    return state.reparaciones.modelos
}

export const EstadoReparaciones = (state) => state.reparaciones.estadoreparaciones
export const EstadoUsuarios = (state) => state.reparaciones.estadousuarios
export const EstadoMarcas = (state) => state.reparaciones.estadomarcas
export const EstadoModelos = (state) => state.reparaciones.estadomodelos

export const ErroresReparaciones = (state) => state.reparaciones.erroresreparaciones
export const ErroresUsuarios = (state) => state.reparaciones.erroresusuarios
export const ErroresMarcas = (state) => state.reparaciones.erroresmarcas
export const ErroresModelos = (state) => state.reparaciones.erroresmodelos