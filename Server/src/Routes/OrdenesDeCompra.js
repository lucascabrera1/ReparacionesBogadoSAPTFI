import express from 'express'
import ocs from '../Controllers/OrdenesDeCompra.js'
import verifyToken from "../Middlewares/VerifyToken.js"
import {isEncargadoDeCompras, isAdmin, isEncargadoDeDeposito, isEncargadoDeVentas, isECoEV} from '../Middlewares/authJwt.js'
import { ValidarOrdenDeCompra } from '../Middlewares/validateEntryData.js'
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

//const validarSeguridadMarcas = ()

router.route('/marcas')
    .post([verifyToken, isEncargadoDeCompras], ocs.AgregarMarca)
    .get([verifyToken, isECoEV], ocs.ObtenerMarcas)

router.route('/formasdepago')
    .post([verifyToken, isEncargadoDeCompras], ocs.AgregarFormaDePago)
    .get([verifyToken, isECoEV], ocs.RecuperarFormasDePago)

router.route('/productos')
    .post([verifyToken, isEncargadoDeCompras], ocs.AgregarProducto)
    .get([verifyToken, isECoEV], ocs.RecuperarProductos)

router.route('/lineacompra')
    .post([verifyToken, isEncargadoDeCompras], ocs.AgregarLineaCompra)

router.route('/proveedores')
    .get([verifyToken, isEncargadoDeCompras], ocs.RecuperarProveedores)
    .post([verifyToken, isEncargadoDeCompras], ocs.AgregarProveedor)

router.route('/categorias')
    .get([verifyToken, isECoEV], ocs.RecuperarCategorias)

router.route('/marcas/:id')
    .delete([verifyToken, isEncargadoDeCompras], ocs.EliminarMarca)

router.route('/marcas/modelos/:idMarca')
    .post([verifyToken, isEncargadoDeCompras], ocs.AgregarModelo)
    .get([verifyToken, isEncargadoDeCompras], ocs.RecuperarModelos)

router.route('/marcas/modelos/:idMarca/:id')
    .delete([verifyToken, isEncargadoDeCompras], ocs.EliminarModelo)

router.route('/proveedores/:id')
    .delete( [verifyToken, isAdmin], ocs.EliminarProveedor)
    .patch([verifyToken, isAdmin], ocs.ModificarProveedor)
    .get([verifyToken, isAdmin], ocs.RecuperarUnProveedor)

router.route('/productos/:id')
    .patch([verifyToken, isEncargadoDeCompras], ocs.ModificarProducto)
    .delete([verifyToken, isEncargadoDeCompras], ocs.EliminarProducto)

router.route('/productos/:idProveedor')
    .get([verifyToken, isEncargadoDeCompras], ocs.RecuperarProductosPorProveedor)

router.route('/ordenesdecompra')
    .get([verifyToken, isEncargadoDeCompras], ocs.RecuperarOrdenesDeCompra)
    .post([verifyToken, isEncargadoDeCompras, ValidarOrdenDeCompra], ocs.GenerarOrdenDeCompra)

router.route('/ordenesdecompra/:id')
    .get([verifyToken, isEncargadoDeCompras], ocs.RecuperarOrdenDeCompra)
    .patch([verifyToken, isEncargadoDeCompras], ocs.ActualizarEstado)
    
export default router