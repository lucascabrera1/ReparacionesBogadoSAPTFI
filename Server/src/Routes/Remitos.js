import express from 'express'
import remitos from '../Controllers/Remitos.js'
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

router.route('/inicio').get(remitos.RecuperarOrdenesDeCompra)
router.route('/linearemito').post(remitos.AgregarLineaRemito)
router.route('/linearemito/:idremito/:idlinearemito').delete(remitos.EliminarLineaRemito)
router.route('/nuevoremito').post(remitos.AgregarRemito)
router.route('/remito/:id').delete(remitos.EliminarRemito)


export default router