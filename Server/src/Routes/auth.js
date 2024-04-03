import { Router } from "express";
import auth from "../Controllers/Auth.js";
import verifyToken from "../Controllers/VerifyToken.js";

const router = Router()

router.post('/signin', auth.SignIn)
router.post('/signup', auth.SignUp)
router.get('/me', verifyToken, auth.Me)

export default router