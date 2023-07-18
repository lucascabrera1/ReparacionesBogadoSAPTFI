import OrdenDeCompra from '../Models/OrdenDeCompra'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
//const stoken = process.env.SECRET
import LineaCompra from '../Models/LineaCompra'

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

export default {GenerarOrdenDeCompra, ObtenerOrdenesDeCompra}