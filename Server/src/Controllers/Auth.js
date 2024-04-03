import User from "../Models/User.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET

const SignIn = async (req, res, next) => {
    console.log(stoken)
    const {email, contraseña} = req.body
    console.log(email, contraseña)
    const user = await User.findOne({email: email})
    if (!user) {
        return res.status(400).send("User or password invalid")
    }
    const pwdisvalid = await user.validatePassword(contraseña)
    if (!pwdisvalid) {
        return res.status(400).send({user: null, token: null})
    }
    console.log('password: ' + pwdisvalid)
    const token = jwt.sign({id: user._id}, stoken, {
        expiresIn: 60 * 60 *24
    })
    res.json({user: user, token: token})
}

const Me =  async (req, res, next) => {
    const user = await User.findById(req.userId)
    if (!user) {
        res.status(404).send('User not founded')
    } else {
        res.json(user)
    }
}

const SignUp = async (req, res, next) => {
    const {nombreUsuario, email, password, roles} = req.body
    console.log(req.body)
    const result = await User.schema.methods.encryptPassword(password)
    console.log(result)
    const newUser = new User ({
        nombreUsuario,
        email,
        password: await User.schema.methods.encryptPassword(password),
        roles
    })
    const savedUser = await newUser.save()
    console.log(stoken)
    const token = jwt.sign({_id : newUser._id}, stoken, {
        expiresIn: 60
    })

    res.status(200).json(savedUser)
    //res.send(newUser)
    console.log(newUser)
}

export default {SignIn, SignUp, Me}