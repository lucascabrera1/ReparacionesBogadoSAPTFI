import Presupuesto from '../Models/Presupuesto.js'
import Cliente from '../Models/Cliente.js'
import Marca from '../Models/Marca.js'
import Modelo from '../Models/Modelo.js'
import FormaDePago from '../Models/FormaDePago.js'
import { formatNumber, convertirFecha, isValidDateFormat } from '../Middlewares/validateEntryData.js'
import { isValidObjectId } from 'mongoose'
import User from '../Models/User.js'
import Role from '../Models/Role.js'

const ValidarDiagnosticar = async (presdiag) => {
    const {precioAproximado, fechaAproxEntrega, diagnostico} = presdiag
    const fecha = convertirFecha(fechaAproxEntrega)
    let today = convertirFecha(new Date())
    if (!formatNumber(precioAproximado)) {
        return {
            error : true,
            message : "Falta el precio o el formato no es el adecuado"
        }
    }
    if (!isValidDateFormat(fecha) || fecha<today) {
        return {
            error : true,
            message : "La fecha es obligatoria, debe tener el formato correcto y ser posterior a hoy"
        }
    }
    if (!diagnostico || diagnostico.length === 0) {
        return {
            error : true,
            message : "El diagnostico es obligatorio"
        }
    }
    return {
        error : false,
        message : "Datos correctos"
    }
}

const validarReparacion = async (reparacion) => {
    const {fechaEntrega, precio, formaDePago} = reparacion
    console.log(reparacion)
    console.log(precio)
    const fecha = convertirFecha(fechaEntrega)
    let today = convertirFecha(new Date())
    if (!formatNumber(precio)) {
        return {
            error : true,
            message : "Falta el precio o el formato no es el adecuado"
        }
    }
    if (!isValidDateFormat(fecha) || fecha<today) {
        return {
            error : true,
            message : "La fecha es obligatoria, debe tener el formato correcto y no ser inferior a hoy"
        }
    }
    if (!formaDePago) {
        return {
            error: true,
            message: "La forma de pago es obligatoria"
        }
    }
    if (!(isValidObjectId(formaDePago))) {
        return { 
            error: true,
            message: "Formato de ID de forma de pago no válido" 
        }
    }
    const fpe = await FormaDePago.findById({_id: formaDePago})
    if (!fpe) {
        return {
            error: true,
            message: "La forma de pago no existe"
        }
    }
    return {
        error : false,
        message : "datos correctos"
    }
}


const AgregarPresupuesto = async (req, res) => {
    try {
        const presupuesto = new Presupuesto(req.body)
        const pressaved = await presupuesto.save()
        return res.status(200).json(pressaved)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const DiagnosticarPresupuesto = async (req, res) => {
    try {
        const result = await ValidarDiagnosticar(req.body)
        if (!result.error) {
            const {precioAproximado, diagnostico, fechaAproxEntrega} = req.body
            const presupuesto = await Presupuesto.findByIdAndUpdate(
                {_id : req.params.id},
                {$set: {
                    estado : "Presupuestado",
                    precioAproximado,
                    diagnostico,
                    fechaAproxEntrega
                }},
                {new: true}
            )
            return res.status(200).json(presupuesto)
        } else {
            return res.status(400).json(result.message)
        }
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const ConfirmarPresupuesto = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findByIdAndUpdate(
            {_id : req.params.id},
            {$set: {estado : "Confirmado"}},
            {new: true}
        )
        return res.status(200).json(presupuesto)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const DescartarPresupuesto = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findByIdAndUpdate(
            {_id : req.params.id},
            {$set: {estado : "Descartado"}},
            {new: true}
        )
        return res.status(200).json(presupuesto)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const AgregarReparacion = async (req,res) => {
    try {
        const result = await validarReparacion(req.body)
        if (!result.error) {
            const {fechaEntrega, precio, formaDePago} = req.body
            const presupuesto = await Presupuesto.findByIdAndUpdate(
                {_id : req.params.id},
                {$set : {
                    estado : "Reparado",
                    fechaEntrega,
                    precio, 
                    formaDePago
                }},
                {new : true}
            )
            return res.status(200).json(presupuesto)
        } else {
            return res.status(400).json(result.message)
        }
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const RecuperarPresupuestosIngresados = async (req, res) => {
    try {
        const presupuestos = await Presupuesto.find({estado : "Ingresado"})
        console.log(presupuestos)
        let presupuestosrecuperados = []
        for (const elem of presupuestos) {
            const {_id, codigo, cliente, estado, falla, fechaIngreso, marca, modelo} = elem
            const {nombreUsuario} = await User.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id: marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            let newPresupuesto = {_id, codigo, cliente : nombreUsuario, estado, falla, fechaIngreso,
                marca: nombremarca, modelo : nombremodelo,
            }
            presupuestosrecuperados.push(newPresupuesto)
        }
        return res.status(200).json(presupuestosrecuperados)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const RecuperarPresupuestoIngresado = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById({_id : req.params.id})
        console.log("llega a la linea 191")
        console.log(presupuesto)
        console.log("fin presupuesto")
        const {codigo, cliente, estado, falla, fechaIngreso, marca, modelo} = presupuesto
        const {nombreUsuario} = await User.findById({_id : cliente})
        const {nombre : nombremarca} = await Marca.findById({_id: marca})
        const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
        let newPresupuesto = {codigo, cliente : nombreUsuario, estado, falla, fechaIngreso,
            marca: nombremarca, modelo : nombremodelo,
        }
        return res.status(200).json(newPresupuesto)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const RecuperarPresupuestosDiagnosticadosConfimadosYDescartados = async (req, res) => {
    try {
        const presupuestos = await Presupuesto.find({estado : "Presupuestado" || "Confirmado" || "Descartado"})
        console.log(presupuestos)
        let presupuestosrecuperados = []
        for (const elem of presupuestos) {
            const {codigo, cliente, estado, falla, fechaIngreso, marca, modelo,
                diagnostico, precioAproximado, fechaAproxEntrega
            } = elem
            const {nombreyapellido} = await Cliente.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id: marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            let newPresupuesto = { codigo, cliente : nombreyapellido, estado, falla, fechaIngreso,
                marca: nombremarca, modelo : nombremodelo, diagnostico, precioAproximado, fechaAproxEntrega
            }
            presupuestosrecuperados.push(newPresupuesto)
        }
        return res.status(200).json(presupuestosrecuperados)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const RecuperarPresupuestosReparados = async (req, res) => {
    try {
        const presupuestos = await Presupuesto.find({estado : "Reparado"})
        console.log(presupuestos)
        let presupuestosrecuperados = []
        for (const elem of presupuestos) {
            const {codigo, cliente, estado, falla, fechaIngreso, marca, modelo, diagnostico,
                fechaAproxEntrega, precioAproximado, fechaEntrega, precio, formaDePago
            } = elem
            const {nombreyapellido} = await Cliente.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id: marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            const {descripcion} = await FormaDePago.findById({_id : formaDePago})
            let newPresupuesto = { codigo, cliente : nombreyapellido, estado, falla, fechaIngreso,
                fechaAproxEntrega, precioAproximado, marca: nombremarca, modelo : nombremodelo,
                fechaEntrega, precio, diagnostico, formaDePago : descripcion
            }
            presupuestosrecuperados.push(newPresupuesto)
        }
        return res.status(200).json(presupuestosrecuperados)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const RecuperarPresupuestosPorCliente = async (req, res) => {
    try {
        const presupuestos = await Presupuesto.find({cliente : req.params.idCliente})
        let presupuestosrecuperados = []
        for (const elem of presupuestos) {
            const {_id, codigo, cliente, estado, falla, fechaIngreso, marca, modelo, diagnostico,
                fechaAproxEntrega, precioAproximado, fechaEntrega, precio, formaDePago, fechaRetiro
            } = elem
            console.log('inicio elem')
            console.log(elem)
            console.log('fin elem')
            const {nombreUsuario} = await User.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id: marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            let newPresupuesto = {}
            switch(estado) {
                case "Ingresado" : 
                    console.log("Ingresa por donde el presupuesto fue ingresado")
                    console.log(estado)
                    newPresupuesto = { 
                        _id,
                        codigo, 
                        cliente : nombreUsuario, 
                        estado, 
                        falla, 
                        fechaIngreso,
                        marca: nombremarca, 
                        modelo : nombremodelo,
                    }
                case "Confirmado" :
                case "Presupuestado" :
                case "Descartado" :
                    console.log("Ingresa por donde el presupuesto fue presupuestado confirmado o descartado")
                    console.log(estado)
                    newPresupuesto = {
                        _id,
                        codigo, 
                        cliente : nombreUsuario, 
                        estado, 
                        falla, 
                        fechaIngreso,
                        marca: nombremarca, 
                        modelo : nombremodelo,
                        fechaAproxEntrega, 
                        precioAproximado,  
                        diagnostico
                    }
                case "Reparado" : 
                    console.log("Ingresa por donde el presupuesto fue Reparado")
                    console.log(estado)
                    newPresupuesto = {
                        _id,
                        codigo, 
                        cliente : nombreUsuario, 
                        estado, 
                        falla, 
                        fechaIngreso,
                        marca: nombremarca, 
                        modelo : nombremodelo,
                        fechaAproxEntrega, 
                        precioAproximado,  
                        diagnostico,
                        fechaEntrega, 
                        precio
                    }
                case "Reparado y Entregado" || "Descartado y Entregado" : 
                    console.log("entra donde el estado es entregado y reparado")
                    console.log(estado)
                    console.log(formaDePago)
                    console.log("arriba estado y forma de pago")
                    //const {descripcion} = await FormaDePago.findById({_id : formaDePago})
                    //console.log(descripcion)
                    newPresupuesto = {
                        _id,
                        codigo, 
                        cliente : nombreUsuario, 
                        estado, 
                        falla, 
                        fechaIngreso,
                        marca: nombremarca, 
                        modelo : nombremodelo,
                        fechaAproxEntrega, 
                        precioAproximado,  
                        diagnostico,
                        fechaEntrega, 
                        precio,
                        fechaRetiro,
                        //formaDePago : descripcion
                    }
                default : console.log("no se encontró ningún presupuesto con el estado " + estado)
            }
            presupuestosrecuperados.push(newPresupuesto)
        }
        return res.status(200).json(presupuestosrecuperados)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const RecuperarUsuarios = async (req, res) => {
    try {
        const roluser = await Role.findOne({nombre : 'user'})
        const usuarios = await User.find({roles : roluser._id})
        return res.send(usuarios)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

export default {
    AgregarPresupuesto,
    DiagnosticarPresupuesto,
    ConfirmarPresupuesto,
    DescartarPresupuesto,
    AgregarReparacion,
    RecuperarPresupuestosDiagnosticadosConfimadosYDescartados,
    RecuperarPresupuestosIngresados,
    RecuperarPresupuestoIngresado,
    RecuperarPresupuestosReparados,
    RecuperarPresupuestosPorCliente,
    RecuperarUsuarios
}