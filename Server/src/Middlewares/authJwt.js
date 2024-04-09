import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET
import User from "../Models/User.js"
import Role from '../Models/Role.js'


export const isEncargadoDeCompras = async (req, res, next) => {
    const user = await User.findById({_id: req.params.idUser})
    console.log(user)
    const roles = await Role.find({_id: {$in: user.roles}})
    console.log(roles)
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
        const token = req.headers['x-access-token']
        const decoded = jwt.verify(token, stoken)
        console.log('decoded')
        console.log(decoded)
        console.log('fin decoded')
        req.userId = decoded.id
        console.log('llega a isadmin, req.body abajo')
        console.log(req.body)
        console.log('req.body arriba')
        const user = await User.findById(req.userId)
        console.log(user)
        console.log('user recuperado metodo isadmin linea 37 (deberia ser el logueado)')
        const roles = await Role.find({_id: {$in: user.roles}})
        console.log(roles)
        console.log('arriba roles')
        for (let i=0; i< roles.length; i++) {
            if (roles[i].nombre === "admin") {
                next();
                return;
            }
        }
    } catch (error) {
        return res.status(403).json({message: "Requiere el rol de Administrador"})
    }
}

export const isProveedor = async (req, res, next) => {
    const user = await User.findById({_id: req.params.idUser})
    console.log(user)
    const roles = await Role.find({_id: {$in: user.roles}})
    console.log(roles)
    for (let i=0; i< roles.length; i++) {
        if (roles[i].nombre === "Proveedor") {
            next();
            return;
        }
    }
    return res.status(403).json({message: "Requiere el rol de Proveedor"})
}