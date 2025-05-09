import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import ReturnError from './ReturnError'
//import { RecuperarModelos } from './OrdenCompraSlice'

const initialState = {
    reparaciones : [],
    usuarios : [],
    marcas : [],
    modelos : [],
    formasdepago : [],
    reportes : [],
    presupuestosconfirmados : [],
    presupuestosingresados : [],
    presupuestosreparados : [],
    presupuestos : [],
    estadoreparaciones : "idle",
    estadousuarios : "idle",
    estadomarcas : "idle",
    estadomodelos : "idle",
    estadoreportes : "idle",
    estadoformasdepago : "idle",
    estadopresupuestosingresados : "idle",
    estadopresupuestosconfirmados : "idle",
    estadopresupuestosreparados : "idle",
    estadopresupuestos : "idle",
    erroresreparaciones : null,
    erroresusuarios : null,
    erroresmarcas : null,
    erroresmodelos : null,
    erroresformasdepago : null,
    erroresreporte : null,
    errorespresupuestosingresados : null,
    errorespresupuestosconfirmados : null,
    errorespresupuestosreparados : null,
    errorespresupuestos : null
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
            message : ReturnError(error.message)
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
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const RecuperarPresupuestoConfirmado = createAsyncThunk("Reparaciones/RecuperarPresupuestoConfirmado", async(id) => {
    try {
        const url = URL_BASE_REPARACIONES + "/ingresar/" + id
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const RecuperarPresupuestoReparado = createAsyncThunk("Reparaciones/RecuperarPresupuestoReparado", async(id) => {
    try {
        const url = URL_BASE_REPARACIONES + "/finalizar/" + id
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const IngresarReparacion = createAsyncThunk("Reparaciones/IngresarReparacion", async (pres) => {
    try {
        console.log("llega a ingresar reparacion")
        const url = URL_BASE_REPARACIONES + "/ingresar/" + pres.id
        console.log(url)
        console.log(pres)
        const response = await axios.patch(url, pres)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const FinalizarReparacion = createAsyncThunk("Reparaciones/FinalizarReparacion", async (pres) => {
    try {
        console.log("llega a finalizar reparacion")
        const url = URL_BASE_REPARACIONES + "/finalizar/" + pres.id
        console.log(url)
        console.log(pres)
        const response = await axios.patch(url, pres)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
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
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const RecuperarPresupuestosReparados = createAsyncThunk("Reparaciones/RecuperarPresupuestosReparados", async() => {
    try {
        const url = URL_BASE_REPARACIONES + "/presupuestosreparados"
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const RecuperarFormasDePago = createAsyncThunk("Reparaciones/RecuperarFormasDePago", async() => {
    try {
        const url = URL_BASE_REPARACIONES + "/formasdepago"
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const RecuperarTodosLosPresupuestos = createAsyncThunk("Reparaciones/RecuperarTodosLosPresupuestos", async() => {
    try {
        const url = URL_BASE_REPARACIONES + "/todoslospresupuestos"
        const response = await axios.get(url)
        console.log(response)
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        const result = {error: true, message: ReturnError(error)}
        console.error(error)
        return result
    }
})

export const ArmarReporteReparaciones = createAsyncThunk("Reparaciones/ArmarReporteReparaciones", async() => {
    try {
        const url = URL_BASE_REPARACIONES + "/todaslasreparaciones"
        const response = await axios.get(url)
        console.log(response)
        console.log("ejecuta correctamente armar reporte reparaciones")
        const result = {error : false, data : response.data}
        return result
    } catch (error) {
        console.log("error al armar reporte de reparaciones")
        const result = {error: true, message: ReturnError(error)}
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
        .addCase(RecuperarFormasDePago.fulfilled, (state, action) => {
            state.estadoformasdepago = "completed"
            if (!action.payload.error) {
                state.formasdepago = action.payload.data
            } else {
                state.erroresformasdepago = action.payload.message
            }
        })
        .addCase(ArmarReporteReparaciones.fulfilled, (state, action) => {
            state.estadoreportes = "completed"
            if (!action.payload.error) {
                state.reportes = action.payload.data
            } else {
                state.erroresreporte = action.payload.message
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
            state.estadopresupuestosconfirmados = "completed"
            if (!action.payload.error) {
                state.presupuestosingresados = action.payload.data
            } else {
                state.errorespresupuestosingresados = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestosConfirmados.fulfilled, (state, action) => {
            state.estadopresupuestosconfirmados = "completed"
            if (!action.payload.error) {
                state.presupuestosconfirmados = action.payload.data
            } else {
                state.errorespresupuestosconfirmados = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestosReparados.fulfilled, (state, action) => {
            state.estadopresupuestosreparados = "completed"
            if (!action.payload.error) {
                state.presupuestosreparados = action.payload.data
            } else {
                state.errorespresupuestosreparados = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestoIngresado.fulfilled, (state, action) => {
            if (!action.payload.error) {
                state.presupuestosingresados = action.payload.data
            } else {
                state.errorespresupuestosingresados = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestoConfirmado.fulfilled, (state, action) => {
            if (!action.payload.error) {
                state.presupuestosconfirmados = action.payload.data
            } else {
                state.erroresreparaciones = action.payload.message
            }
        })
        .addCase(RecuperarPresupuestoReparado.fulfilled, (state, action) => {
            if (!action.payload.error) {
                state.presupuestosreparados = action.payload.data
            } else {
                state.errorespresupuestosreparados = action.payload.message
            }
        })
        .addCase(DiagnosticarPresupuesto.fulfilled, (state, action) => {
            const index = state.reparaciones.reparaciones.findIndex(item => item._id === action.payload.data._id);
            if (index !== -1) {
                state.reparaciones[index] = action.payload.data; // Actualiza el elemento
            }
        })
        .addCase(ConfirmarPresupuesto.fulfilled, (state, action) => {
            const index = state.reparaciones.findIndex(item => item._id === action.payload.data._id);
            if (index !== -1) {
                state.reparaciones[index] = action.payload.data; // Actualiza el elemento
            }
        })
        .addCase(DescartarPresupuesto.fulfilled, (state, action) => {
            const index = state.reparaciones.findIndex(item => item._id === action.payload.data._id);
            if (index !== -1) {
                state.reparaciones[index] = action.payload.data; // Actualiza el elemento
            }
        })
        .addCase(IngresarReparacion.fulfilled, (state, action) => {
           state.estadoreparaciones = "idle"
           console.log(state.reparaciones)
            const index = state.reparaciones.findIndex(item => item._id === action.payload.data._id);
            if (index !== -1) {
                state.reparaciones[index] = action.payload.data; // Actualiza el elemento
            }
        })
        .addCase(RecuperarTodosLosPresupuestos.fulfilled, (state, action) => {
            state.estadopresupuestos = "completed"
            if (!action.payload.error) {
                state.presupuestos = action.payload.data
            } else {
                state.errorespresupuestos = action.payload.message
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

export const SeleccionarTodasLasFormasDePago = (state) => {
    return state.reparaciones.formasdepago
}

export const SeleccionarTodosLosPresupuestosIngresados = (state) => {
    return state.reparaciones.presupuestosingresados
}


export const SeleccionarTodosLosPresupuestosConfirmados = (state) => {
    return state.reparaciones.presupuestosconfirmados
}

export const SeleccionarTodosLosPresupuestosReparados = (state) => {
    return state.reparaciones.presupuestosreparados
}

export const SeleccionarTodosLosPresupuestos = (state) => {
    return state.reparaciones.presupuestos
}

export const SeleccionarReporte = (state) => {
    return state.reparaciones.reportes
}

export const EstadoReparaciones = (state) => state.reparaciones.estadoreparaciones
export const EstadoUsuarios = (state) => state.reparaciones.estadousuarios
export const EstadoMarcas = (state) => state.reparaciones.estadomarcas
export const EstadoModelos = (state) => state.reparaciones.estadomodelos
export const EstadoFormasDePago = (state) => state.reparaciones.estadoformasdepago
export const EstadoReportes = (state) => state.reparaciones.estadoreportes
export const EstadoPresupuestosIngresados = (state) => state.reparaciones.estadopresupuestosingresados
export const EstadoPresupuestosConfirmados = (state) => state.reparaciones.estadopresupuestosconfirmados
export const EstadoPresupuestosReparados = (state) => state.reparaciones.estadopresupuestosreparados
export const EstadoPresupuestos = (state) => state.reparaciones.estadopresupuestos

export const ErroresReparaciones = (state) => state.reparaciones.erroresreparaciones
export const ErroresUsuarios = (state) => state.reparaciones.erroresusuarios
export const ErroresMarcas = (state) => state.reparaciones.erroresmarcas
export const ErroresModelos = (state) => state.reparaciones.erroresmodelos
export const ErroresFormasDePago = (state) => state.reparaciones.erroresformasdepago
export const ErroresReportes = (state) => state.reparaciones.erroresreporte
export const ErroresPresupuestosIngresados = (state) => state.reparaciones.errorespresupuestosingresados
export const ErroresPresupuestosConfirmados = (state) => state.reparaciones.errorespresupuestosconfirmados
export const ErroresPresupuestosReparados = (state) => state.reparaciones.errorespresupuestosreparados
export const ErroresPresupuestos = (state) => state.reparaciones.errorespresupuestos