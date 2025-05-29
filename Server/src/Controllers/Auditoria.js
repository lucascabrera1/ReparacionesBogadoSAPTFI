import AuditoriaPresupuestos from '../Models/AuditoriaPresupuestos.js'
//import AuditoriaLoginLogout from '../Models/AuditoriaLoginLogout.js'
import { convertirFecha } from '../Middlewares/validateEntryData.js'
import Presupuesto from '../Models/Presupuesto.js'
import User from '../Models/User.js'

const today = new Date()
const fechahora = convertirFecha(today)

const AgregarAuditoriaPresupuestos = async (req, res) => {
    console.log("entra al metodo agregar auditoria de presupuesto")
    try {
        console.log("entra al try del metodo agregar auditoria de presupuesto")
        const {user, codigo} = req.body
        console.log('user y codigo')
        console.log(user)
        console.log(codigo)
        console.log("fin user y codigo")
        console.log("a continuacion el presupuesto recuperado")
        const {_id : idpresupuesto, estado} = await Presupuesto.findOne({codigo : codigo})
        let operacion = ""
        if (idpresupuesto) {
            switch(estado) {
                case "Diagnosticado" : operacion = "Diagnosticó el presupuesto"; break
                case "Confirmado" : operacion = "Confirmó el presupuesto"; break 
                case "Rechazado" : operacion = "Rechazó el presupuesto"; break
                case "Reparado" : operacion = "El equipo ya fue reparado" ;break
                case "Reparado y retirado" : operacion = "El equipo ya fue reparado y entregado"; break
                default : operacion = "Ingresó un nuevo presupuesto"; break
            }
            const newAuditoriaPresupuesto = new AuditoriaPresupuestos({
                user, 
                presupuesto : idpresupuesto,
                operacion, 
                fechahora : today
            })
            console.log("newAutoriaPresupuesto")
            console.log(newAuditoriaPresupuesto)
            const auditoriasaved = await newAuditoriaPresupuesto.save()
            console.log("auditoria saved")
            console.log(auditoriasaved)
            console.log("fin auditoria saved")
            return res.status(200).json(auditoriasaved)
        } else {
            return res.status(400).json(`El presupuesto ${codigo} es inexistente`)
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}

const RecuperarAuditoriasPresupuesto = async (req, res) => {
    try {
        const auditorias = await AuditoriaPresupuestos.find()
        let auditoriaspresupuestos = []
        for (const elem of auditorias) {
            const {user, presupuesto, operacion, fechahora} = elem
            const {nombreUsuario} = await User.findById({_id : user})
            const {codigo} = await Presupuesto.findById({_id : presupuesto})
            let newAuditoria = {
                presupuesto : codigo,
                user : nombreUsuario,
                operacion,
                fechahora
            }
            auditoriaspresupuestos.push(newAuditoria)
        }
        return res.status(200).json(auditoriaspresupuestos)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            error : true,
            message : error.message
        })
    }
}

export default {AgregarAuditoriaPresupuestos, RecuperarAuditoriasPresupuesto}