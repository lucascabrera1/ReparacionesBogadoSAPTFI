import express from 'express'
import ocs from '../Controllers/OrdenesDeCompra.js'
import reparaciones from '../Controllers/Reparaciones.js'
import auditoria from '../Controllers/Auditoria.js'
import verifyToken from "../Middlewares/VerifyToken.js"
import {isEncargadoDeReparaciones, isUser} from '../Middlewares/authJwt.js'
import { CheckDuplicateUser } from '../Middlewares/verifiSignUp.js'
import auth from '../Controllers/Auth.js'
import { ValidarPresupuesto } from '../Middlewares/validateEntryData.js'
import morgan from 'morgan'
import { requestContextMiddleware } from '../Middlewares/request-context.js'

const router = express()

router.use(express.json())
router.use(morgan('short'))

//middleware sin morgan
 router.use((req, res, next) => {
    console.log(`url : ${req.url} method: ${req.method}`)
    console.log("paso por la funcion app.use")
    console.log(req.params)
    next()
})

router.route('/ingresar').post([requestContextMiddleware, verifyToken, isEncargadoDeReparaciones, ValidarPresupuesto],  reparaciones.AgregarPresupuesto)
router.route('/presupuestosingresados').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestosIngresados)
router.route('/presupuestosdcyd').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestosDiagnosticadosConfimadosYDescartados)
router.route('/presupuestosconfirmados').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestosConfirmados)
router.route('/presupuestosreparados').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestosReparados)
router.route('/diagnosticar/:id')
    .patch([verifyToken, isEncargadoDeReparaciones], reparaciones.DiagnosticarPresupuesto)
    .get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestoIngresado)
router.route('/confirmar/:id').patch([verifyToken, isUser], reparaciones.ConfirmarPresupuesto)
router.route('/descartar/:id').patch([verifyToken, isUser], reparaciones.DescartarPresupuesto)
router.route('/ingresar/:id')
    .patch([verifyToken, isEncargadoDeReparaciones], reparaciones.AgregarReparacion)
    .get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestoConfirmado)
router.route('/finalizar/:id')
    .patch([verifyToken, isEncargadoDeReparaciones], reparaciones.FinalizarReparacion)
    .get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestoReparado)
router.route('/registrarme').post([CheckDuplicateUser], auth.SignUp)
router.route('/misreparaciones/:idCliente').get([verifyToken, isUser], reparaciones.RecuperarPresupuestosPorCliente)
router.route('/marcas').get([requestContextMiddleware, verifyToken, isEncargadoDeReparaciones], ocs.ObtenerMarcas)
router.route('/modelos/:idMarca').get([requestContextMiddleware, verifyToken, isEncargadoDeReparaciones], ocs.RecuperarModelos)
router.route('/usuarios').get([requestContextMiddleware, verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarUsuarios)
router.route('/formasdepago').get([verifyToken, isEncargadoDeReparaciones], ocs.RecuperarFormasDePago)
router.route('/todaslasreparaciones').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarReparacionesParaReporte)
router.route('/todoslospresupuestos').get([requestContextMiddleware, verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarTodosLosPresupuestos)

export default router