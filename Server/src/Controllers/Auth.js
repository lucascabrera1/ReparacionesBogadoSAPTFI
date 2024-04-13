import User from "../Models/User.js"
import Role from "../Models/Role.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET

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
        const newUser = new User ({
            nombreUsuario,
            email,
            password: await User.schema.methods.encryptPassword(password)
        })
        const token = jwt.sign({_id : newUser._id}, stoken, {
            expiresIn: "10h"
        })
        if (roles) {
            const foundRoles = await Role.find({nombre: {$in: roles}})
            newUser.roles = foundRoles.map(role => role._id)
        } else {
            const role = await Role.findOne({nombre: "user"})
            newUser.roles = [role._id]
        }
        const savedUser = await newUser.save()
        res.status(200).json({token})
        console.log(savedUser)
    } catch (error) {
        console.error(error)
    }
   
}

export default {SignIn, SignUp, Me}