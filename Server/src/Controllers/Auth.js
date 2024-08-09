import User from "../Models/User.js"
import Role from "../Models/Role.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { RandomPassword } from "../Utils/Random.js"
import sendmail from "../Utils/SendMail.js"
dotenv.config({path: './.env'})
const stoken = process.env.SECRET
const URL_BASE = process.env.URL_CLIENT

const SignIn = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email: email}).populate("roles")
        if (!user) {
            return res.status(400).send("User doesn't exists")
        }
        let pwdisvalid = await user.validatePassword(password)
        if (!pwdisvalid) {
            return res.status(400).send({user: null, token: null})
        }
        const token = jwt.sign({id: user._id}, stoken, {
            expiresIn: "10h"
        })
        res.json({user, token})
    } catch (error) {
        console.error(error)
    }
    console.log("pasa exitosamente el signin")
}

const Me =  async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            res.status(404).send('User not founded')
        } else {
            res.json(user)
        }
    } catch (error) {
        console.error(error)
    }
    
}

const SignUp = async (req, res, next) => {
    try {
        const {nombreUsuario, email, password, roles} = req.body
        console.log(roles)
        const newUser = new User ({
            nombreUsuario,
            email,
            password: await User.schema.methods.encryptPassword(password)
        })
        /* me parece que cuando registro no necesito un token (pero si cuando hago login)
         const token = jwt.sign({_id : newUser._id}, stoken, {
            expiresIn: "10h"
        }) */
        if (roles) {
            const foundRoles = await Role.find({nombre: {$in: roles}})
            //newUser.roles =  foundRoles.map(role => role._id)
            newUser.roles = foundRoles
        } else {
            const role = await Role.findOne({nombre: "user"})
            newUser.roles = [role._id]
        }
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
        console.log(savedUser)
    } catch (error) {
        console.error(error)
    }
}

const DeleteUser = async (req, res) => {
    try {
        const userfound = await User.findOneAndRemove({_id: req.params.id})
        if (!userfound || userfound.length === 0){
            return res.status(404).json({
                error: true,
                message: "User not found"
            })
        }
        return res.status(200).json(userfound)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

/* const EditUser = async (req, res) => {
     try {
        const useram = req.body
        if (useram.password) useram.password = await User.schema.methods.encryptPassword(useram.password)
        if (useram.roles) {
            const foundRoles = await Role.find({nombre: {$in:useram.roles}})
            console.log("inicio foundRoles Modificar")
            console.log(foundRoles)
            useram.roles = foundRoles
            console.log(useram.roles)
            console.log("fin foundRoles Modificar")
            //user.roles = foundRoles.map(role => role._id)
            
        }
        const updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, useram, {new : true})
        console.log(updatedUser)
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: error.message})
    }
} */

/* const EditUser = async (req, res) => {
    try {
        let {nombreUsuario, password, email, roles} = req.body
        console.log("roles original")
        console.log(roles)
        console.log("fin roles original")
        let rolesuser = []
        if (password) password = await User.schema.methods.encryptPassword(password)
        if (roles) {
            const foundRoles = await Role.find({nombre: {$in:roles}})
            for (const item of foundRoles){
                let newRol = {
                    _id : item._id,
                    nombre: item.nombre,
                    descripcion : item.descripcion
                }
                rolesuser.push(newRol)
            }
        }
        console.log("roles user")
        console.log(rolesuser)
        console.log("fin rolesuser")
        const useram = {
            nombreUsuario, password, email, roles : rolesuser
        }
        let updatedUser = await User.findByIdAndUpdate({_id : req.params.id}, useram, {new : true})
        console.log(updatedUser)
        return res.status(200).json(updatedUser)
   } catch (error) {
       console.error(error)
       return res.status(500).json({message: error.message})
   }
} */

const EditUser = async (req, res) => {
    try {
        let {nombreUsuario, email, roles} = req.body
        //const updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, {useram}, {new : true})
        let updatedUser = await User.findOne({_id: req.params.id})
        updatedUser.nombreUsuario = nombreUsuario
        updatedUser.email = email
        if (roles) {
            const foundRoles = await Role.find({nombre: {$in: roles}})
            updatedUser.roles = foundRoles
        }
        console.log(updatedUser)
        await updatedUser.save()
        return res.status(200).json(updatedUser)
   } catch (error) {
       console.error(error)
       return res.status(500).json({message: error.message})
   }
}

const getUsers = async (req, res) => {
    console.log("llega al getUsers")
    try {
        console.log(req.params)
        const usuarios = await User.find({})
        console.log("pasa el User.find({})")
        let usuariosdevueltos = []
        console.log(usuarios)
        for (const elem of usuarios) {
            elem.password = await User.schema.methods.encryptPassword(elem.password)
            let roles = []
            for (const newItem of elem.roles){
                const rol = await Role.findById({_id: newItem})
                console.log("rol")
                console.log(rol)
                console.log("fin rol")
                let newRol = {
                    _id : rol._id,
                    nombre: rol.nombre,
                    descripcion: rol.descripcion
                }
                roles.push(newRol)
            }
            let newElem = {
                _id : elem._id,
                nombreUsuario : elem.nombreUsuario,
                email : elem.email,
                password : await User.schema.methods.encryptPassword(elem.password),
                createdAt : elem.createdAt,
                updatedAt : elem.updatedAt,
                roles : roles
            }
            usuariosdevueltos.push(newElem)
        }
        return res.json(usuariosdevueltos);
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: error.message})
    }
}

const GetUser = async (req, res) =>{
    try {
        const userfound = await User.findOne({_id: req.params.id})
        if (!userfound || userfound.length === 0){
            return res.status(404).json({
                error: true,
                message: "User not found"
            })
        }
        let roles = []
        for (const newItem of userfound.roles) {
            const rol = await Role.findById({_id : newItem})
            let newRol = {
                _id: rol._id,
                nombre: rol.nombre,
                descripcion : rol.descripcion
            }
            roles.push(newRol)
        }
        userfound.password = await User.schema.methods.encryptPassword(userfound.password)
        let user = {
            _id: userfound._id,
            nombreUsuario: userfound.nombreUsuario,
            email : userfound.email,
            password: userfound.password,
            createdAt: userfound.createdAt,
            updatedAt: userfound.updatedAt,
            roles
        }
        return res.status(200).json(user)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

const SendMailToResetPassword = async (req, res) => {
    const {email} = req.body
    console.log(email)
    const userFounded = await User.findOne({email})
    if (!userFounded) return res.status(400).json({message: `user ${email} doesn't exists`})
    try {
        //res.send("llamada exitosa al metodo SendMailToResetPassword")
        const secret = stoken + userFounded.password
        const token = jwt.sign(
            {
                email : userFounded.email, 
                id : userFounded._id
            }, secret, {
                expiresIn : "50m"
            }
        )
        const link = `${URL_BASE}/reset-password/${userFounded._id}/${token}`
        const htmlContent = `
            <h2>Haga click en el siguiente link para resetear su contraseña</h2>
            <a href = "${link}">${link}</a>
            <h3>Recuerde que tiene 50 minutos para recuperar su contraseña antes que este link caduque</h3>
        `
        const result = await sendmail.sendEmail(userFounded.email, "link para recuperar password",link, htmlContent)
        console.log(result.messageId)
        /* console.log("inicio resultado de llamar a sendMail")
        console.log("fin resultado de llamar a sendMail")
        console.log(link) */
        return res.status(200).json({link})
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

/* const ResetPassword = async (req, res) => {
    const {email} = req.body
    console.log(email)
    try {
        const userFounded = await User.findOne({email})
        if (!userFounded) return res.status(400).json({message: `user ${email} doesn't exists`})
        const randompassword = RandomPassword(8)
        console.log(randompassword)
        userFounded.password = await User.schema.methods.encryptPassword(randompassword)
        await userFounded.save()
        return res.status(200).json({
            message: `La clave del usuario ${userFounded.nombreUsuario} fue actualizada correctamete`
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
} */

const ResetPassword = async (req, res) => {
    const {id, token} = req.params
    try {
        const userFounded = await User.findOne({_id : id})
        if (!userFounded) return res.status(400).json({
            message: `user ${userFounded.email} doesn't exists`
        })
        const randompassword = RandomPassword(8)
        console.log(randompassword)
        const secret = stoken + userFounded.password
        const verify = jwt.verify(token, secret)
        console.log("inicio verify")
        console.log(verify)
        console.log("fin verify")
        if (verify.error) return res.status(400).json({
            message: "token invalido o expirado, repita el proceso"
        })
        const htmlContent = `su nueva clave es ${randompassword} Le recomendamos cambiarla enseguida`
        userFounded.password = await User.schema.methods.encryptPassword(randompassword)
        const sendedpassword = await sendmail.sendEmail(userFounded.email, "su nueva contraseña", randompassword, htmlContent)
        console.log(sendedpassword)
        await userFounded.save()
        return res.status(200).json({
            verified : verify,
            message: `La clave del usuario ${userFounded.nombreUsuario} fue actualizada correctamete`
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

const ChangePassword = async (req, res) => {
    try {
        let {cnp} = req.body
        let {id} = req.params
        let updatedUser = await User.findOne({_id: id})
        updatedUser.password = await User.schema.methods.encryptPassword(cnp)
        await updatedUser.save()
        return res.status(200).json(updatedUser)
   } catch (error) {
       console.error(error)
       return res.status(500).json({message: error.message})
   }
}

const ValidateLink = async (req, res) => {
    const {id, token} = req.params
    const foundedUser = await User.findOne({_id: id})
    if (!foundedUser) return res.status(400).json({
        message : "user doesn't founded"
    })
    const secret = stoken + foundedUser.password
    try {
        const verify = jwt.verify(token, secret)
        res.status(200).json({
            message : verify
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message : error
        })
    }
}

export default {SignIn, SignUp, Me, DeleteUser, EditUser, getUsers, GetUser, ResetPassword,
    ValidateLink, SendMailToResetPassword, ChangePassword}