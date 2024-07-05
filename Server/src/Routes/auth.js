import { Router } from "express";
import auth from "../Controllers/Auth.js";
import verifyToken from "../Controllers/VerifyToken.js";
import {checkRoles, CheckDuplicateUser} from "../Middlewares/verifiSignUp.js"
import { isAdmin, isAdminorFinalUser } from "../Middlewares/authJwt.js";

const router = Router()

router.post('/signin', auth.SignIn)
router.post('/signup', [verifyToken ,checkRoles, CheckDuplicateUser, isAdmin], auth.SignUp)
router.get('/me', verifyToken, auth.Me)
router.get('/users', [verifyToken, isAdmin], auth.getUsers)
router.route('/users/:id')
    .patch([verifyToken ,checkRoles, CheckDuplicateUser, isAdmin], auth.EditUser)
    .get([verifyToken, isAdmin], auth.GetUser)
    .delete([verifyToken, isAdmin], auth.DeleteUser)
router.route('/reset-password')
    .patch([verifyToken, isAdminorFinalUser], auth.ResetPassword)
    .post(auth.SendMailToResetPassword)
export default router