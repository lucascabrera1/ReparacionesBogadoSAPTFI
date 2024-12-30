import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET
import User from "../Models/User.js"
import Role from '../Models/Role.js'


export const isEncargadoDeCompras = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, stoken)
    req.userId = decoded.id
    const user = await User.findById(req.userId)
    const roles = await Role.find({_id: {$in: user.roles}})
    for (let i=0; i< roles.length; i++) {
        if (roles[i].nombre === "Encargado de Compras") {
            next();
            return;
        }
    }
    return res.status(403).json({message: "Requiere el rol de Encargado de Compras"})
}

export const isEncargadoDeVentas = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, stoken)
    const user = await User.findById(decoded.id)
    console.log("inicio decoded")
    console.log(decoded)
    console.log("fin decoded")
    const roles = await Role.find({_id: {$in: user.roles}})
    console.log(roles)
    for (let i=0; i< roles.length; i++) {
        if (roles[i].nombre === "Encargado de Ventas") {
            next();
            return;
        }
    }
    return res.status(403).json({message: "Requiere el rol de Encargados de Ventas"})
}

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, stoken)
        const user = await User.findById(decoded.id)
        const roles = await Role.find({_id: {$in: user.roles}})
        for (let i=0; i< roles.length; i++) {
            if (roles[i].nombre === "admin") {
                next();
                return;
            }
        }
        return res.status(403).json({message: "Requiere el rol de Administrador"})
    } catch (error) {
        return res.status(500).json({message: "Recurso no encontrado"})
    }
}

export const isAdminorFinalUser = async (req, res, next) => {
    try {
        const {email} = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, stoken)
        const user = await User.findById(decoded.id)
        const roles = await Role.find({_id: {$in: user.roles}})
        for (let i=0; i< roles.length; i++) {
            if (roles[i].nombre === "admin") {
                next()
                return
            }
        }
        if (email === user.email) {
            next()
            return
        }
        return res.status(403).json({message: "Requiere el rol de Administrador"})
    } catch (error) {
        return res.status(500).json({message: "Recurso no encontrado"})
    }
}

export const isEncargadoDeDeposito = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, stoken)
        req.userId = decoded.id
        const user = await User.findById(req.userId)
        const roles = await Role.find({_id: {$in: user.roles}})
        for (let i=0; i< roles.length; i++) {
            if (roles[i].nombre === "Encargado de Depósito") {
                next();
                return;
            }
        }
        return res.status(403).json({message: "Requiere el rol de Encargado de Depósito"})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
}

export const isProveedor = async (req, res, next) => {
    const user = await User.findById({_id: req.params.idUser})
    const roles = await Role.find({_id: {$in: user.roles}})
    for (let i=0; i< roles.length; i++) {
        if (roles[i].nombre === "Proveedor") {
            next();
            return;
        }
    }
    return res.status(403).json({message: "Requiere el rol de Proveedor"})
}

export const validNewPassword = async (req, res, next) => {
    try {
        const {op, np, cnp} = req.body
        const {id} = req.params
        const user = await User.findById({_id: id})
        if (!user) return res.status(404).json({message: "el usuario no existe"})
        let compare = await user.validatePassword(op)
        if (!compare || compare === false) {
            return (res.status(403).json({message : "contraseña incorrecta"}))
        }
        if (np !== cnp) {
            return (res.status(403).json({message: "las nuevas claves no coinciden"}))
        }
        console.log("validate password succesfully")
        next()
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}