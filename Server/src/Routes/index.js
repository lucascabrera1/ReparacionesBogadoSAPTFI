import { Router } from "express";

import ocs from './OrdenesDeCompra.js'
import auth from './auth.js'
import remitos from './Remitos.js'
import ventas from './ventas.js'
import reparaciones from './Reparaciones.js'
import auditoria from './Auditoria.js'

const router = Router()

router.route('/').get(function(req,res) {
    res.send("Bienvenido a la api del proyecto Reparaciones Bogado")
})

router.use('/', ocs)
router.use('/auth', auth)
router.use('/remitos/', remitos)
router.use('/ventas', ventas)
router.use('/reparaciones', reparaciones)
router.use('/auditoria', auditoria)

export default router