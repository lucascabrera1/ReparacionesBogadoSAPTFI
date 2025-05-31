import express from 'express'
import auditoria, {auditarSesion} from '../Controllers/Auditoria.js'
import verifyToken from "../Middlewares/VerifyToken.js"
import { isAdmin } from '../Middlewares/authJwt.js'
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

router.route('/presupuestos').get([verifyToken, isAdmin], auditoria.RecuperarAuditoriasPresupuesto)
router.route('/loginlogout')
    .get([verifyToken, isAdmin], auditoria.RecuperarAuditoriasLoginLogout)
    .post(auditarSesion)
export default router