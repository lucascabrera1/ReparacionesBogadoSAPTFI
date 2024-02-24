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
                proveedor: proveedorencontrado.razonsocial,
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
                subtotal: item.subtotal,
                faltante: item.cantidad
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
        console.log(req.body.items)
        let items = []
        for(const elem of req.body.items) {
            console.log(elem)
            const lr = new LineaRemito()
            lr.lineaCompra = elem.lineaCompra
            lr.cantidadIngresada = elem.cantidadIngresada
            const lrguardada = await lr.save()
            items.push(lrguardada)
        }
        const remito = new Remito(req.body)
        remito.items = items
        console.log(remito)
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
        /* console.log('linea remito')
        console.log(lre)
        console.log('fin linea remito')
        const remitoasociado = await Remito.findOne({_id: req.params.idremito})
        console.log('remito asociado') */
        await Remito.updateOne({_id: req.params.idremito}, {$pull: {'items': req.params.idlinearemito}})
        /*console.log('fin remito asociado')
        console.log('inicio req.params')
        console.log(req.params)
        console.log('fin req.params')
        console.log('inicio req.body')
        console.log(req.body)
        console.log('fin req.body')
        const lre = req.params
        let remitoasociado = await Remito.find({_id : req.params.idremito})
        console.log('inicio remito asociado')
        
        console.log(remitoasociado)
        console.log('fin remito asociado') */

        /* console.log(req.body)
        const lre = await LineaRemito.findOneAndRemove({_id: req.params.id})
        const remitoasociado = await Remito.findOneAndUpdate(
            {items: req.params.idremito},
            {new: false},
            {$pull: {items: req.params.idlinearemito}}
        )
        console.log(lre)
        console.log('remito asociado')
        console.log(remitoasociado)
        console.log('fin remito asociado') */


        /* const remitoasociado = await Remito.find(remito => {
            remito.items.findById(x => {
                x._id === lre._id
            })
        })
        console.log(remitoasociado) */
        /*console.log(remitos)
        console.log(req.params)
        const idremitoasociado = await Remito.find(
            items.map(item => {
                item === req.params.id
            })
        )
        console.log('id remito asociado')
        console.log(idremitoasociado)
        console.log('id remito asociado') */
        /* let idremitoasociado = remitos.map(remito => {
            remito.items.map(item => {
                req.params.id === item._id
            })
        }) */
        /* remitos.map(remito => {
            console.log('remito')
            console.log(remito)
            console.log('fin remito')
            remito.items.splice(item => {
                console.log('item linea 148')
                console.log(item)
                console.log('item linea 150')
                req.params.id === item._id
            })
        }) */
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
        return res.status(200).json(lre)
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
        return res.status(200).json(remitoencontrado)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}

export default {
    RecuperarOrdenDeCompra,
    RecuperarOrdenesDeCompra,
    AgregarLineaRemito,
    AgregarRemito,
    EliminarRemito,
    EliminarLineaRemito
}