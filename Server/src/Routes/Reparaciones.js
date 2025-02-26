import express from 'express'
import ocs from '../Controllers/OrdenesDeCompra.js'
import reparaciones from '../Controllers/Reparaciones.js'
import verifyToken from "../Middlewares/VerifyToken.js"
import {isEncargadoDeReparaciones, isUser} from '../Middlewares/authJwt.js'
import { CheckDuplicateUser } from '../Middlewares/verifiSignUp.js'
import auth from '../Controllers/Auth.js'
import { ValidarPresupuesto } from '../Middlewares/validateEntryData.js'
import morgan from 'morgan'

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

router.route('/ingresar').post([verifyToken, isEncargadoDeReparaciones, ValidarPresupuesto], reparaciones.AgregarPresupuesto)
router.route('/presupuestosingresados').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestosIngresados)
router.route('/presupuestosdcyd').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestosDiagnosticadosConfimadosYDescartados)
router.route('/presupuestosreparados').get([verifyToken, isEncargadoDeReparaciones], reparaciones.RecuperarPresupuestosReparados)
router.route('/diagnosticar/:id').patch([verifyToken, isEncargadoDeReparaciones], reparaciones.DiagnosticarPresupuesto)
router.route('/confirmar/:id').patch([verifyToken, isEncargadoDeReparaciones], reparaciones.ConfirmarPresupuesto)
router.route('/descartar/:id').patch([verifyToken, isEncargadoDeReparaciones], reparaciones.DescartarPresupuesto)
router.route('/ingresar/:id').patch([verifyToken, isEncargadoDeReparaciones], reparaciones.AgregarReparacion)
router.route('/registrarme').post([CheckDuplicateUser], auth.SignUp)
router.route('/misreparaciones/:idCliente').get([verifyToken, isUser], reparaciones.RecuperarPresupuestosPorCliente)

export default router