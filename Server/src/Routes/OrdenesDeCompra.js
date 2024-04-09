import express from 'express'
import ocs from '../Controllers/OrdenesDeCompra.js'
import verifyToken from "../Controllers/VerifyToken.js"
import {isEncargadoDeCompras, isAdmin} from '../Middlewares/authJwt.js'
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

router.route('/marcas')
    .post(ocs.AgregarMarca)
    .get(ocs.ObtenerMarcas)
router.route('/formasdepago')
    .post(ocs.AgregarFormaDePago)
    .get(ocs.RecuperarFormasDePago)
router.route('/productos')
    .post(ocs.AgregarProducto)
    .get(ocs.RecuperarProductos)
router.route('/lineacompra').post(ocs.AgregarLineaCompra)
router.route('/proveedores')
    .get(ocs.RecuperarProveedores)
    .post(ocs.AgregarProveedor)
router.route('/categorias').get(ocs.RecuperarCategorias)
router.route('/marcas/:id').delete(ocs.EliminarMarca)
router.route('/proveedores/:id/:idUser')
    .delete( [verifyToken, isAdmin], ocs.EliminarProveedor)
    .patch(ocs.ModificarProveedor)
    .get(ocs.RecuperarUnProveedor)
router.route('/productos/:id/:idUser')
    .patch(ocs.ModificarProducto)
    .delete([verifyToken, isEncargadoDeCompras], ocs.EliminarProducto)
router.route('/productos/:idProveedor')
    .get(ocs.RecuperarProductosPorProveedor)
router.route('/ordenesdecompra')
    .get(ocs.RecuperarOrdenesDeCompra)
    .post(ocs.GenerarOrdenDeCompra)
router.route('/ordenesdecompra/:id')
    .get(ocs.RecuperarOrdenDeCompra)
export default router