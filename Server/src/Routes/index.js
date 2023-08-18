import { Router } from "express";

import ocs from './OrdenesDeCompra.js'

const router = Router()

router.use('/', ocs)

export default router