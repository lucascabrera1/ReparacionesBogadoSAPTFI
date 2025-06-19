import AuditoriaPresupuestos from '../Models/AuditoriaPresupuestos.js'
//import AuditoriaLoginLogout from '../Models/AuditoriaLoginLogout.js'
import AuditoriaLoginLogout from '../Models/AuditoriaLoginLogout.js'
import { convertirFecha } from '../Middlewares/validateEntryData.js'
import Presupuesto from '../Models/Presupuesto.js'
import User from '../Models/User.js'
import Marca from '../Models/Marca.js'
import Modelo from '../Models/Modelo.js'
import FormaDePago from '../Models/FormaDePago.js'
import { isValidObjectId } from 'mongoose'
import { aHoraArgentina } from '../Utils/Random.js'

const today = new Date()
const fechahora = convertirFecha(today)

/* const AgregarAuditoriaPresupuestos = async (req, res) => {
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
} */

const AgregarAuditoriaLogout = async (req, res) => {
    try {
        const newlogout = {
            user: req.body.user,
            action: req.body.action,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        }
        const newaudlogout = new AuditoriaLoginLogout(newlogout)
        const audsaved = await newaudlogout.save()
        return res.status(200).json(audsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: error})
    }
}

export async function auditarSesion( {user, action, ip, userAgent}) {
    if (!['login', 'logout'].includes(action)) {
        throw new Error('Acción inválida para auditoría de sesión');
    }
    const newaud = await AuditoriaLoginLogout.create({
        user,
        action,
        ip,
        userAgent,
    });
    console.log(newaud)
}

 //@param {string} idUsuario
 //@returns {Promise<string>} nombre del usuario o "sistema"
export async function obtenerUsuarioSeguro(idUsuario) {
  if (!idUsuario ||typeof idUsuario !== 'string' || idUsuario.toLowerCase() === 'sistema') {
    return 'sistema';
  }

  // Validar que sea un ObjectId válido antes de buscar
  if (!isValidObjectId(idUsuario)) {
    return '(ID inválido)';
  }

  try {
    const usuario = await User.findById(idUsuario).lean();
    console.log(usuario?.nombreUsuario)
    return usuario?.nombreUsuario || '(usuario no encontrado)';
  } catch (err) {
    console.error('Error buscando usuario:', err);
    return '(error al buscar usuario)';
  }
}

const RecuperarAuditoriasPresupuesto = async (req, res) => {
    try {
        const auditorias = await AuditoriaPresupuestos.find()
        let auditoriasrecuperadas = []
        for (const elem of auditorias) {
            const {user, collectionname, action, documentId, after, before, timestamp} = elem
            let marcaDocbefore = null;
            let modeloDocbefore = null;
            if (before?.marca) marcaDocbefore = await Marca.findById(before.marca);
            if (before?.modelo) modeloDocbefore = await Modelo.findById(before.modelo);
            let marcaDocafter = null;
            let modeloDocafter = null;
            let fpago = null;
            if (after?.marca) marcaDocafter = await Marca.findById(after.marca);
            if (after?.modelo) modeloDocafter = await Modelo.findById(after.modelo);
            if (after?.formaDePago) fpago = await FormaDePago.findById(after.formaDePago);
            let newauditoria = {
                usuario : await obtenerUsuarioSeguro(user),//faltaria un await
                action,
                timestamp,
                antes : before ? {
                    //implementar logica con anibal del before
                    codigo : before.codigo?before.codigo:"",
                    cliente :await obtenerUsuarioSeguro(before.cliente.toString()),
                    estado : before.estado?before.estado:"",
                    falla : before.falla?before.falla:"",
                    fechaIngreso : before.fechaIngreso?before.fechaIngreso:"",
                    marca: marcaDocbefore?.nombre || "",
                    modelo: modeloDocbefore?.nombre || "",
                    diagnostico: before.diagnostico?before.diagnostico:"",
                    fechaAproxEntrega: before.fechaAproxEntrega?before.fechaAproxEntrega:"",
                    precioAproximado: before.precioAproximado?before.precioAproximado:"",
                    fechaEntrega: before.fechaEntrega?before.fechaEntrega:"",
                    precio: before.precio?before.precio:"",
                    fechaRetiro: before.fechaRetiro?before.fechaRetiro:"",
                    formaDePago: before.formaDePago?before.formaDePago : ""
                } : "",
                despues : after ? {
                    //implementar logica del after con anibal
                    codigo : after.codigo?after.codigo:"",
                    cliente : after.cliente? await obtenerUsuarioSeguro(after.cliente.toString()) :"",
                    estado : after.estado?after.estado:"",
                    falla : after.falla?after.falla:"",
                    fechaIngreso : after.fechaIngreso?after.fechaIngreso:"",
                    marca: marcaDocafter?.nombre || "",
                    modelo: modeloDocafter?.nombre || "",
                    diagnostico: after.diagnostico?after.diagnostico:"",
                    fechaAproxEntrega: after.fechaAproxEntrega?after.fechaAproxEntrega:"",
                    precioAproximado: after.precioAproximado?after.precioAproximado:"",
                    fechaEntrega: after.fechaEntrega?after.fechaEntrega:"",
                    precio: after.precio?after.precio:"",
                    fechaRetiro: after.fechaRetiro?after.fechaRetiro:"",
                    formaDePago: fpago?.descripcion || ""
                } : ""
            }
            auditoriasrecuperadas.push(newauditoria)
        }
        /* let auditoriaspresupuestos = []
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
        } */
        return res.status(200).json(auditoriasrecuperadas)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            error : true,
            message : error.message
        })
    }
}

const RecuperarAuditoriasLoginLogout = async (req, res) => {
    try {
        const auditorias = await AuditoriaLoginLogout.find()
        let auditoriasrecuperadas = []
        for (const elem of auditorias) {
            const {user, action, timestamp, ip, userAgent} = elem
            const newaud = {
                user,
                action,
                timestamp,
                ip,
                userAgent
            }
            auditoriasrecuperadas.push(newaud)
        } 
        return res.status(200).json(auditoriasrecuperadas)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            error : true,
            message : error.message
        })
    }
}

export default {RecuperarAuditoriasPresupuesto, RecuperarAuditoriasLoginLogout, AgregarAuditoriaLogout}