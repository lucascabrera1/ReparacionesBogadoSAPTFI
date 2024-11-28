import express from 'express'
import remitos from '../Controllers/Remitos.js'
import ocs from '../Controllers/OrdenesDeCompra.js'
import morgan from 'morgan'
import verifyToken from "../Middlewares/VerifyToken.js"
import {isEncargadoDeDeposito, isAdmin} from '../Middlewares/authJwt.js'
import { ValidarRemitoDeCompra } from '../Middlewares/validateEntryData.js'

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

router.route('/inicio')
    .get([verifyToken, isEncargadoDeDeposito], remitos.RecuperarOrdenesDeCompra)
router.route('/linearemito')
    .post([verifyToken, isEncargadoDeDeposito], remitos.AgregarLineaRemito)
router.route('/linearemito/:idremito/:idlinearemito')
    .delete([verifyToken, isEncargadoDeDeposito], remitos.EliminarLineaRemito)
/* router.route('/nuevoremito')
    .post([verifyToken, isEncargadoDeDeposito, ValidarRemitoDeCompra], remitos.AgregarRemito) */
router.route('/remito/:id')
    .delete([verifyToken, isEncargadoDeDeposito], remitos.EliminarRemito)
    .get([verifyToken, isEncargadoDeDeposito], remitos.RecuperarRemitoDeCompra)
router.route('/todos')
    .get([verifyToken, isEncargadoDeDeposito], remitos.RecuperarRemitos)
    .post([verifyToken, isEncargadoDeDeposito, ValidarRemitoDeCompra], remitos.AgregarRemito)
router.route('/lineascompra/:idoc')
    .get([verifyToken, isEncargadoDeDeposito], remitos.RecuperarLineasDeCompra)
router.route('/proveedores')
    .get([verifyToken, isEncargadoDeDeposito], ocs.RecuperarProveedores)

export default router