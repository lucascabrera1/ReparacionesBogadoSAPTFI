import { Router } from "express";

import ocs from './OrdenesDeCompra.js'
import remitos from './Remitos.js'

const router = Router()

router.route('/').get(function(req,res) {
    res.send("Bienvenido a la api del proyecto Reparaciones Bogado")
})

router.use('/', ocs)
router.use('/remitos/', remitos)

export default router