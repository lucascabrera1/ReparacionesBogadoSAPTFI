import { Router } from "express";
import auth from "../Controllers/Auth.js";
import verifyToken from "../Controllers/VerifyToken.js";
import {checkRoles, CheckDuplicateUser} from "../Middlewares/verifiSignUp.js"
import { isAdmin } from "../Middlewares/authJwt.js";

const router = Router()

router.post('/signin', auth.SignIn)
router.post('/signup', [verifyToken ,checkRoles, CheckDuplicateUser, isAdmin], auth.SignUp)
router.get('/me', verifyToken, auth.Me)

export default router