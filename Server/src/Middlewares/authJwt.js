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
    const user = await User.findById({_id: req.params.idUser})
    console.log(user)
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