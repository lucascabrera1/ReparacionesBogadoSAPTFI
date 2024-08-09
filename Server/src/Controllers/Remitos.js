import OrdenDeCompra from '../Models/OrdenDeCompra.js'
import FormaDePago from '../Models/FormaDePago.js'
import LineaCompra from '../Models/LineaCompra.js'
import Producto from '../Models/Producto.js'
import Proveedor from '../Models/Proveedor.js'
import LineaRemito from '../Models/LineaRemito.js'
import Remito from '../Models/Remito.js'
import Categoria from '../Models/Categoria.js'
import Marca from '../Models/Marca.js'

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
//const stoken = process.env.SECRET

const port = process.env.PORT
console.log(port)

const RecuperarOrdenesDeCompra = async (req, res, next) => {
    try {
        const ocs = await OrdenDeCompra.find({})
        let ocsdevueltas = []
        for (const elem of ocs) {
            let proveedorencontrado = await Proveedor.findById(elem.proveedor)
            let formadepagoencontrada = await FormaDePago.findById(elem.formaDePago)
            let items = []
            for (const newItem of elem.items){
                let item = await LineaCompra.findById(newItem)
                items.push(item)
            }
            let newElem = {
                _id : elem._id,
                formapago: formadepagoencontrada.descripcion,
                fechaemision: elem.fechaEmision,
                fechaentrega: elem.fechaEntrega,
                proveedor: {
                    _id: proveedorencontrado._id,
                    razonsocial: proveedorencontrado.razonsocial
                },
                total: elem.total,
                items: elem.items
            }
            ocsdevueltas.push(newElem)
        }
        return res.send(ocsdevueltas)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const RecuperarRemitos = async (req, res, next) => {
    try {
        console.log("llega a la api de recuperar remitos")
        const remitos = await Remito.find({})
        let remitosdevueltos = []
        for (const elem of remitos) {
            let proveedorencontrado = await Proveedor.findById(elem.proveedor)
            let ocencontrada = await OrdenDeCompra.findById(elem.ordenCompra)
            if (!ocencontrada) continue
            let items = []
            for (const newItem of elem.items){
                let lr = await LineaRemito.findById({_id: newItem._id})
                let lc = await LineaCompra.findById({_id: lr.lineaCompra})
                let producto = await Producto.findById({_id: lc.producto})
                let newLineaRemito = {
                    producto : producto.descripcion,
                    cantidadesperada : lc.cantidad,
                    cantidadrecibida : lr.cantidadIngresada,
                    subtotal: lc.subtotal,
                    faltante: lc.cantidad - lr.cantidadIngresada
                }
                console.log(newLineaRemito)
                items.push(newLineaRemito)
            }
            let newElem = {
                _id : elem._id,
                ordenCompra: ocencontrada._id,
                fechaemision: elem.fechaEmision,
                proveedor: proveedorencontrado.razonsocial,
                items
            }
            remitosdevueltos.push(newElem)
        }
        return res.send(remitosdevueltos)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}

const RecuperarOrdenDeCompra = async (req, res, next) => {
    try {
        const oc = await OrdenDeCompra.findById({_id : req.params.id})
        if (!oc){
            return res.status(404).json({
                error: true,
                message: "Orden de Compra no encontrada"
            })
        }
        let proveedorencontrado = await Proveedor.findById(oc.proveedor)
        let formadepagoencontrada = await FormaDePago.findById(oc.formaDePago)
        let items = []
        for (const newItem of oc.items){
            let item = await LineaCompra.findById(newItem)
            let productorecuperado = await Producto.findById(item.producto)
            let newElem = {
                _id: newItem._id,
                producto: productorecuperado.descripcion,
                preciocompra: productorecuperado.preciocompra,
                cantidad: item.cantidad,
                subtotal: item.subtotal
            }
            items.push(newElem)
        }
        let ocDevuelta = {
            _id : oc._id,
            formapago: formadepagoencontrada.descripcion,
            fechaemision: oc.fechaEmision,
            fechaentrega: oc.fechaEntrega,
            proveedor: proveedorencontrado.razonsocial,
            total: oc.total,
            items: items
        }
        return res.send(ocDevuelta)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const RecuperarLineasDeCompra = async (req, res) => {
    try {
        const oc = await OrdenDeCompra.findOne({_id: req.params.idoc})
        if (!oc){
            return res.status(404).json({
                error: true,
                message: "Orden de Compra no encontrada"
            })
        }
        let lcsdevueltas = []
        for (const elem of oc.items) {
            let lc = await LineaCompra.findById({_id: elem})
            let productorecuperado = await Producto.findById(lc.producto)
            let newElem = {
                _id: lc._id,
                producto: productorecuperado.descripcion,
                preciocompra: productorecuperado.preciocompra,
                cantidad: lc.cantidad,
                subtotal: lc.subtotal,
                faltante: lc.cantidad
            }
            lcsdevueltas.push(newElem)
        }
        console.log(lcsdevueltas)
        return res.send(lcsdevueltas)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
}

const RecuperarRemitoDeCompra = async (req, res, next) => {
    try {
        console.log('-----------------inicio req.params-----------------')
        console.log(req.params)
        console.log('-----------------fin req.params-----------------')
        const remito = await Remito.findById({_id : req.params.id})
        if (!remito){
            return res.status(404).json({
                error: true,
                message: "Remito no encontrado"
            })
        }
        let proveedorencontrado = await Proveedor.findById(remito.proveedor)
        let items = []
        for (const newItem of remito.items){
            let item = await LineaRemito.findById(newItem)
            
            let lcr = await LineaCompra.findById(item.lineaCompra)
            let productorecuperado = await Producto.findById(lcr.producto)
            let newElem = {
                _id: newItem._id,
                producto: productorecuperado.descripcion,
                cantidadRecibida: item.cantidadIngresada,
                cantidadEsperada: lcr.cantidad,
                faltante: lcr.cantidad - item.cantidadIngresada
            }
            items.push(newElem)
        }
        let remitoDevuelto = {
            _id : remito._id,
            fechaemision: remito.fechaEmision,
            proveedor: proveedorencontrado.razonsocial,
            ordenCompra : remito.ordenCompra,
            items
        }
        return res.send(remitoDevuelto)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const AgregarLineaRemito = async (req, res) => {
    try {
        console.log("entra a agregar linea remito")
        const lr = new LineaRemito(req.body)
        console.log(lr)
        const lrsaved = await lr.save()
        console.log(lrsaved)
        return res.send(lrsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}

const AgregarRemito = async (req, res) => {
    try {
        let items = []
        for(const elem of req.body.detalles) {
            const lr = new LineaRemito()
            lr.lineaCompra = elem.lineaCompra
            lr.cantidadIngresada = elem.cantidadIngresada
            const lrguardada = await lr.save()
            items.push(lrguardada)
        }
        const remito = new Remito(req.body)
        remito.items = items
        const remito_oc = await Remito.findOne({ordenCompra : req.body.ordenCompra})
        console.log("remito encontrado")
        console.log(remito_oc)
        console.log("fin remito encontrado")
        if (remito_oc) return res.status(409).json({
            error : true,
            message : `ya existe un remito para esa orden de compra, si necesita volver a ingresar un remito elimine el remito ${remito_oc._id}`
        })
        const remitosaved = await remito.save()
        return res.json(remitosaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}


const EliminarLineaRemito = async (req, res) => {
    try {
        const lre = await LineaRemito.findOneAndRemove({_id: req.params.idlinearemito})
        const remitomodificado = await Remito.updateOne(
            {_id: req.params.idremito},
            {$pull: {'items': req.params.idlinearemito}
        })
        if (!lre){
            return res.status(404).json({
                error: true,
                message: "Línea de Remito inexistente"
            })
        }
        if (lre.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Línea de Remito vacía"
            })
        }
        return res.status(200).json([{lre}, {remitomodificado}])
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}

const EliminarRemito = async (req, res) => {
    try {
        const remitoencontrado = await Remito.findOneAndRemove({_id: req.params.id})
        if (!remitoencontrado || remitoencontrado.length === 0){
            return res.status(404).json({
                error: true,
                message: "Remito Inexistente"
            })
        }
        console.log(remitoencontrado.items)
        remitoencontrado.items.forEach(async(item) => {
            let itemeliminado = await LineaRemito.findOneAndRemove(item)
            console.log(itemeliminado)
        })
        return res.status(200).json(remitoencontrado)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}

export default {
    RecuperarOrdenDeCompra,
    RecuperarOrdenesDeCompra,
    RecuperarRemitos,
    RecuperarLineasDeCompra,
    RecuperarRemitoDeCompra,
    AgregarLineaRemito,
    AgregarRemito,
    EliminarRemito,
    EliminarLineaRemito,
}