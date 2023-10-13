import express from 'express'
import ocs from '../Controllers/OrdenesDeCompra.js'
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
router.route('/marcas/:id').delete(ocs.EliminarMarca)
router.route('/proveedores/:id')
    .delete(ocs.EliminarProveedor)
    .patch(ocs.ModificarProveedor)
router.route('/formasdepago').post(ocs.AgregarFormaDePago)
router.route('/productos').post(ocs.AgregarProducto)
router.route('/lineacompra').post(ocs.AgregarLineaCompra)
router.route('/proveedores')
    .get(ocs.RecuperarProveedores)
    .post(ocs.AgregarProveedor)

export default router