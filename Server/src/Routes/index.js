import { Router } from "express";

import ocs from './OrdenesDeCompra.js'
import remitos from './Remitos.js'

const router = Router()

router.use('/', ocs)
router.use('/remitos/', remitos)

export default router