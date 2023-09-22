import OrdenDeCompra from '../Models/OrdenDeCompra.js'
import FormaDePago from '../Models/FormaDePago.js'
import LineaCompra from '../Models/LineaCompra.js'
import Marca from '../Models/Marca.js'
import Producto from '../Models/Producto.js'
import Proveedor from '../Models/Proveedor.js'

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
//const stoken = process.env.SECRET

const port = process.env.PORT
console.log(port)

const GenerarOrdenDeCompra = async(req, res, next) => {
    try {
        const oc = new OrdenDeCompra(req.body)
        console.log(oc)
        const ocsaved = await oc.save()
        return res.json(ocsaved)
    } catch (error) {
        console.error(err)
        return res.status(500).json({message : message.error})
    }
}

const ObtenerOrdenesDeCompra = async (req, res, next) => {
    try {
        const ocs = await OrdenDeCompra.find({})
        let ocsdevueltas = []
        for (const elem of ocs) {
            let items = []
            for (const newItem of elem.items){
                let item = await LineaCompra.findById(item);
                items.push(newItem)
            }
            let newElem = {
                _id : elem._id,
                formapago: elem.formaDePago,
                fechaemision: elem.fechaEmision,
                fechaentrega: elem.fechaEntrega,
                proveedor: elem.proveedor._id,
                total: elem.total,
                items: elem.items
            }
            ocsdevueltas.push(newElem)
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const ObtenerMarcas = async (req, res) => {
    try {
        const marcas = await Marca.find({})
        let marcasdevueltas = []
        for (const elem of marcas) {
            let newElem = {
                _id: elem._id,
                paisorigen : elem.paisorigen,
                nombre: elem.nombre
            }
            marcasdevueltas.push(newElem)
        }
        console.log(marcasdevueltas)
        return res.send(marcasdevueltas)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
    
}

const AgregarMarca = async (req, res) => {
    try {
        const marca = new Marca(req.body)
        console.log(marca)
        const marcasaved = await marca.save()
        console.log(marcasaved)
        return res.send(marcasaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const EliminarMarca = async (req, res) => {
    try {
        const marcaencontrada = await Marca.findOneAndRemove({_id: req.params.id})
        if (!marcaencontrada || marcaencontrada.length === 0){
            return res.status(404).json({
                error: true,
                message: "Marca no encontrada"
            })
        }
        return res.status(200).json(marcaencontrada)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const EliminarProveedor = async (req, res) => {
    try {
        const proveedorencontrado = await Proveedor.findOneAndRemove({_id: req.params.id})
        if (!proveedorencontrado || proveedorencontrado.length === 0){
            return res.status(404).json({
                error: true,
                message: "Proveedor no encontrado"
            })
        }
        return res.status(200).json(proveedorencontrado)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const AgregarFormaDePago = async (req, res) => {
    try {
        const fp = new FormaDePago(req.body)
        console.log(fp)
        const fpsaved = await fp.save()
        console.log(fpsaved)
        return res.send(fpsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const AgregarProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body)
        console.log(producto)
        const productosaved = await producto.save()
        console.log(productosaved)
        return res.send(productosaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const AgregarLineaCompra = async (req, res) => {
    try {
        const lc = new LineaCompra(req.body)
        console.log(lc)
        const lcsaved = await lc.save()
        console.log(lcsaved)
        return res.send(lcsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const RecuperarProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find({})
        let proveedoresdevueltos = []
        for (const elem of proveedores) {
            let newElem = {
                _id: elem._id,
                cuit : elem.cuit,
                direccion : elem.direccion,
                razonsocial: elem.razonsocial,
                email: elem.email,
                localidad: elem.localidad,
                telefono: elem.telefono
            }
            proveedoresdevueltos.push(newElem)
        }
        console.log(proveedoresdevueltos)
        return res.send(proveedoresdevueltos)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
} 

export default {GenerarOrdenDeCompra, 
    ObtenerOrdenesDeCompra, 
    AgregarMarca, 
    AgregarFormaDePago,
    ObtenerMarcas,
    AgregarProducto,
    AgregarLineaCompra,
    RecuperarProveedores,
    EliminarMarca,
    EliminarProveedor
}