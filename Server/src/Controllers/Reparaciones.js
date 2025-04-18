import Presupuesto from '../Models/Presupuesto.js'
import Cliente from '../Models/Cliente.js'
import Marca from '../Models/Marca.js'
import Modelo from '../Models/Modelo.js'
import FormaDePago from '../Models/FormaDePago.js'
import { formatNumber, convertirFecha, isValidDateFormat } from '../Middlewares/validateEntryData.js'
import { isValidObjectId } from 'mongoose'
import User from '../Models/User.js'
import Role from '../Models/Role.js'
import SendMail from '../Utils/SendMail.js'

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
    const {fechaEntrega, precio} = reparacion
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
            const {cliente, marca, modelo, codigo, falla, estado, fechaIngreso} = await Presupuesto.findById({_id : req.params.id})
            const {email, nombreUsuario : nombrecliente} = await User.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id : marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            const subject = `La orden de reparación ${codigo} fue diagnosticada`
            const htmlContent = `<div className='row'>
                <div className='col-md-3'>
                    <label>Código</label>
                    <input disabled value='${codigo}' />
                </div>
                <div className='col-md-3'>
                    <label>Estado</label>
                    <input disabled value='${estado}' />
                </div>
                <div className='col-md-3'>
                    <label>Cliente</label>
                    <input disabled value='${nombrecliente}' />
                </div>
                <div className='col-md-3'>
                    <label>Marca</label>
                    <input disabled value='${nombremarca}'/>
                </div>
                <div className='col-md-3'>
                    <label>Modelo</label>
                    <input disabled value='${nombremodelo}' />
                </div>
                <div className='col-md-3'>
                    <label>Falla</label>
                    <input disabled value='${falla}' />
                </div>
                <div className='col-md-3'>
                    <label>Marca</label>
                    <input disabled value='${fechaIngreso}'/>
                </div>
                <div className='col-md-3'>
                    <label>Precio Aproximado</label>
                    <input disabled value='${precioAproximado}' />
                </div>
                <div className='col-md-3'>
                    <label>Diagnóstico</label>
                    <input disabled value='${diagnostico}' />
                </div>
                <div className='col-md-3'>
                    <label>Fecha aproximada de entrega</label>
                    <input disabled value='${fechaAproxEntrega}'/>
                </div>
                <p>Diríjase a la sección /reparaciones y confirme o rechace su presupuesto</p>
            </div>`
            await SendMail.sendEmail(email, subject, htmlContent)
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
            const {fechaEntrega, precio} = req.body
            const presupuesto = await Presupuesto.findByIdAndUpdate(
                {_id : req.params.id},
                {$set : {
                    estado : "Reparado",
                    fechaEntrega,
                    precio
                }},
                {new : true}
            )
            const {cliente, marca, modelo, codigo, falla, estado, fechaIngreso, diagnostico,
            precioAproximado, fechaAproxEntrega } = await Presupuesto.findById({_id : req.params.id})
            const {email, nombreUsuario : nombrecliente} = await User.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id : marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            const subject = `La orden de reparación ${codigo} fue reparada exitosamente y se encuentra lista para retirar`
            const htmlContent = `<div className='row'>
                <div className='col-md-3'>
                    <label>Código</label>
                    <input disabled value='${codigo}' />
                </div>
                <div className='col-md-3'>
                    <label>Estado</label>
                    <input disabled value='${estado}' />
                </div>
                <div className='col-md-3'>
                    <label>Cliente</label>
                    <input disabled value='${nombrecliente}' />
                </div>
                <div className='col-md-3'>
                    <label>Marca</label>
                    <input disabled value='${nombremarca}'/>
                </div>
                <div className='col-md-3'>
                    <label>Modelo</label>
                    <input disabled value='${nombremodelo}' />
                </div>
                <div className='col-md-3'>
                    <label>Falla</label>
                    <input disabled value='${falla}' />
                </div>
                <div className='col-md-3'>
                    <label>Marca</label>
                    <input disabled value='${fechaIngreso}'/>
                </div>
                <div className='col-md-3'>
                    <label>Precio Aproximado</label>
                    <input disabled value='${precioAproximado}' />
                </div>
                <div className='col-md-3'>
                    <label>Diagnóstico</label>
                    <input disabled value='${diagnostico}' />
                </div>
                <div className='col-md-3'>
                    <label>Fecha aproximada de entrega</label>
                    <input disabled value='${fechaAproxEntrega}'/>
                </div>
                <div className='col-md-3'>
                    <label>Fecha en que fue realizada la reparación</label>
                    <input disabled value='${fechaEntrega}}' />
                </div>
                <div className='col-md-3'>
                    <label>Precio final de la reparación</label>
                    <input disabled value='${precio}'/>
                </div>
            </div>`
            await SendMail.sendEmail(email, subject, htmlContent)
            return res.status(200).json(presupuesto)
        } else {
            return res.status(400).json(result.message)
        }
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const validarFinReparacion = async (newrep) => {
    const {formaDePago} = newrep
    const fpe = await FormaDePago.findById({_id : formaDePago})
    if (!fpe) return {
        error : true,
        message : "Forma de pago no encontrada"
    } 
    return {
        error : false,
        message : fpe.descripcion
    }

}

const FinalizarReparacion = async (req,res) => {
    try {
        const result = await validarFinReparacion(req.body)
        if (!result.error) {
            const {fechaRetiro, formaDePago} = req.body
            const presupuesto = await Presupuesto.findByIdAndUpdate(
                {_id : req.params.id},
                {$set : {
                    estado : "Reparado y Entregado",
                    fechaRetiro,
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

const RecuperarPresupuestoConfirmado = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById({_id : req.params.id})
        console.log("llega a la linea 210")
        console.log(presupuesto)
        console.log("fin presupuesto")
        const {codigo, cliente, estado, falla, fechaIngreso, marca, modelo,
            diagnostico, precioAproximado, fechaAproxEntrega} = presupuesto
        const {nombreUsuario} = await User.findById({_id : cliente})
        const {nombre : nombremarca} = await Marca.findById({_id: marca})
        const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
        let newPresupuesto = {codigo, cliente : nombreUsuario, estado, falla, fechaIngreso,
            marca: nombremarca, modelo : nombremodelo, diagnostico, precioAproximado, fechaAproxEntrega
        }
        return res.status(200).json(newPresupuesto)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const RecuperarPresupuestoReparado = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById({_id : req.params.id})
        console.log("llega a la linea 210")
        console.log(presupuesto)
        console.log("fin presupuesto")
        const {codigo, cliente, estado, falla, fechaIngreso, marca, modelo,
            diagnostico, precioAproximado, fechaAproxEntrega, precio, fechaEntrega
        } = presupuesto
        const {nombreUsuario} = await User.findById({_id : cliente})
        const {nombre : nombremarca} = await Marca.findById({_id: marca})
        const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
        let newPresupuesto = {codigo, cliente : nombreUsuario, estado, falla, fechaIngreso,
            marca: nombremarca, modelo : nombremodelo, diagnostico, precioAproximado, fechaAproxEntrega,
            precio, fechaEntrega
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

const RecuperarPresupuestosConfirmados = async (req, res) => {
    try {
        const presupuestos = await Presupuesto.find({estado : "Confirmado"})
        console.log(presupuestos)
        let presupuestosrecuperados = []
        for (const elem of presupuestos) {
            const {_id, codigo, cliente, estado, falla, fechaIngreso, marca, modelo, diagnostico,
                fechaAproxEntrega, precioAproximado, fechaEntrega, precio
            } = elem
            const {nombreUsuario} = await User.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id: marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            let newPresupuesto = {_id, codigo, cliente : nombreUsuario, estado, falla, fechaIngreso,
                fechaAproxEntrega, precioAproximado, marca: nombremarca, modelo : nombremodelo,
                fechaEntrega, precio, diagnostico
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
            const {_id, codigo, cliente, estado, falla, fechaIngreso, marca, modelo, diagnostico,
                fechaAproxEntrega, precioAproximado, fechaEntrega, precio
            } = elem
            const {nombreUsuario} = await User.findById({_id : cliente})
            const {nombre : nombremarca} = await Marca.findById({_id: marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            //const {descripcion} = await FormaDePago.findById({_id : formaDePago})
            let newPresupuesto = {_id,  codigo, cliente : nombreUsuario, estado, falla, fechaIngreso,
                fechaAproxEntrega, precioAproximado, marca: nombremarca, modelo : nombremodelo,
                fechaEntrega, precio, diagnostico
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

const RecuperarReparacionesParaReporte = async (req, res) => {
    try {
        const reparaciones = await Presupuesto.find()
        let reparacionesdevueltas = []
        for (const elem of reparaciones) {
            const { _id, marca, modelo} = elem
            const {nombre : nombremarca} = await Marca.findById({_id: marca})
            const {nombre : nombremodelo} = await Modelo.findById({_id: modelo})
            const newPresupuesto = {
                _id,
                marca: nombremarca, 
                modelo : nombremodelo,
            }
            reparacionesdevueltas.push(newPresupuesto)
        }
        return res.status(200).json(reparacionesdevueltas)
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
    RecuperarPresupuestosConfirmados,
    RecuperarPresupuestoConfirmado,
    RecuperarPresupuestosReparados,
    RecuperarPresupuestoReparado,
    RecuperarPresupuestosPorCliente,
    RecuperarUsuarios,
    FinalizarReparacion,
    RecuperarReparacionesParaReporte
}