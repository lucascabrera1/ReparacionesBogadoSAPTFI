import Venta from '../Models/Venta.js'
import Cliente from '../Models/Cliente.js'
import LineaVenta from '../Models/LineaVenta.js'
import FormaDePago from '../Models/FormaDePago.js'
import Producto from '../Models/Producto.js'

const AgregarVenta = async (req, res) => {
    try {
        let detalles = []
        for(const elem of req.body.detalles) {
            const lv = new LineaVenta()
            lv.producto = elem.id_producto
            lv.cantidad = elem.cantidad
            lv.subtotal = elem.subtotal
            const lvguardada = await lv.save()
            detalles.push(lvguardada)
        }
        const venta = new Venta(req.body)
        venta.detalles = detalles
        //Actualizo el stock de los productos
        detalles.forEach ( async (item) => {
            console.log("inicio item")
            console.log(item)
            console.log("fin item")
            const updatedProducto = await Producto.findByIdAndUpdate(
                item.producto,
                { $inc : { stock : - item.cantidad}}, //decrementa el stock
                {new: true}
            )
            console.log("inicio updated producto")
            console.log(updatedProducto)
            console.log("fin updated producto")
            await updatedProducto.save()
            
        })
        const ventaSaved = await venta.save()
        return res.json(ventaSaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}

const RecuperarVentas = async (req, res) => {
    try {
        const ventas = await Venta.find()
        let ventasRecuperadas = []
        for (const elem of ventas) {
            const {cliente, formaDePago, fechaEmision, codigo, total} = elem
            let {nombreyapellido} = await Cliente.findById(cliente)
            let {descripcion} = await FormaDePago.findById(formaDePago)
            let detalles = []
            for (const newItem of elem.detalles){
                let {producto, cantidad, subtotal} = await LineaVenta.findById(newItem)
                let {descripcion, precioventa} = await Producto.findById(producto)
                let newLv = {
                    producto : descripcion,
                    cantidad,
                    precioventa,
                    subtotal
                }
                detalles.push(newLv)
            }
            let newVenta = {
                codigo,
                fechaEmision,
                formaDePago : descripcion,
                cliente : nombreyapellido,
                total,
                detalles
            }
            ventasRecuperadas.push(newVenta)
        }
        return res.send(ventasRecuperadas)
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

export default {AgregarVenta, RecuperarVentas}