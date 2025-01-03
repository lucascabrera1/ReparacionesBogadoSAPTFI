import express from 'express'
import morgan from 'morgan'
import verifyToken from "../Middlewares/VerifyToken.js"
import {isEncargadoDeVentas} from '../Middlewares/authJwt.js'
import { ValidarVenta } from '../Middlewares/validateEntryData.js'
import ventas from '../Controllers/Ventas.js'

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

router.route('/')
    .post(ValidarVenta, ventas.AgregarVenta)
    .get([verifyToken, isEncargadoDeVentas], ventas.RecuperarVentas)
router.route('/clientes')
    .post([verifyToken, isEncargadoDeVentas], ventas.AgregarCliente)
    .get([verifyToken, isEncargadoDeVentas], ventas.RecuperarClientes)
router.route('/clientes/:id')
    .patch([verifyToken, isEncargadoDeVentas], ventas.ModificarCliente)
    .delete([verifyToken, isEncargadoDeVentas], ventas.EliminarCliente)

export default router