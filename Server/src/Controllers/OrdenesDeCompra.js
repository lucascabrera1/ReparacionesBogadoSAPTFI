import OrdenDeCompra from '../Models/OrdenDeCompra.js'
import FormaDePago from '../Models/FormaDePago.js'
import LineaCompra from '../Models/LineaCompra.js'
import Marca from '../Models/Marca.js'
import Producto from '../Models/Producto.js'
import Proveedor from '../Models/Proveedor.js'
import Categoria from '../Models/Categoria.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import SendMail from '../Utils/SendMail.js'
dotenv.config({path: '../.env'})
import {convertirFecha, formatNumber} from '../Middlewares/validateEntryData.js'
//const stoken = process.env.SECRET

const port = process.env.PORT
console.log(port)

const GenerarOrdenDeCompra = async(req, res, next) => {
    try {
        let detalles = []
        for(const elem of req.body.detalles) {
            let {preciocompra, descripcion} = await Producto.findById(elem.id_producto)
            console.log(elem)
            const lc = new LineaCompra()
            lc.producto = elem.id_producto
            lc.descripcion = descripcion
            lc.cantidad = elem.cantidad
            lc.preciocompra = preciocompra
            lc.subtotal = elem.subtotal
            const lcguardada = await lc.save()
            detalles.push(lcguardada)
        }
        const oc = new OrdenDeCompra(req.body)
        oc.items = detalles
        const ocsaved = await oc.save()
        console.log("ocsaved")
        console.log(ocsaved)
        console.log("fin ocsaved")
        const {razonsocial, email} = await Proveedor.findById(ocsaved.proveedor)
        const {descripcion} = await FormaDePago.findById(ocsaved.formaDePago)
        const subject = "Tiene una nueva orden de compra pendiente de confirmación o rechazo"
        const border = "style='border: 1px solid #000'"
        const borderyalineacion = "style='border: 1px solid #000; text-align: end'"
        const htmlContent = `
            <div>
                <div className='row'>
                    <div className='col-md-3'>
                        <label>Fecha de Emisión</label>
                        <input disabled value='${convertirFecha(ocsaved.fechaEmision)}' />
                    </div>
                    <div className='col-md-3'>
                        <label>Fecha de entrega</label>
                        <input disabled value='${convertirFecha(ocsaved.fechaEntrega)}' />
                    </div>
                    <div className='col-md-3'>
                        <label>Proveedor</label>
                        <input disabled value='${razonsocial}' />
                    </div>
                    <div className='col-md-3'>
                        <label>Forma de Pago</label>
                        <input disabled value='${descripcion}'/>
                    </div>
                </div>
                <br/>
                <table style='border-spacing: 0 0'>
                    <thead>
                        <tr ${border}>
                            <th ${border}>Producto</th>
                            <th ${border}>Precio Unitario</th>
                            <th ${border}>Cantidad</th>
                            <th ${border}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${detalles.map(item =>
                            `<tr key={${item._id}} ${border}>
                                <td ${border}>${item.descripcion}</td>
                                <td ${borderyalineacion}>${formatNumber(item.preciocompra)}</td>
                                <td ${borderyalineacion}>${item.cantidad}</td>
                                <td ${borderyalineacion}>${formatNumber(item.subtotal)}</td>
                            </tr>`
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th ${border} colspan='2'></th>
                            <th ${border}>Total: </th>
                            <th ${borderyalineacion}>${formatNumber(ocsaved.total)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `
        const result = await SendMail.sendEmail(email, subject, htmlContent)
        console.log(result)
        return res.json(ocsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error})
    }
}

const RecuperarOrdenesDeCompra = async (req, res, next) => {
    try {
        let condition = {}
        if (req.query.fechadesde) {
            condition.$gte = req.query.fechadesde
        }
        if (req.query.fechahasta) {
            condition.$lte = req.query.fechahasta
        }
        const ocs = await OrdenDeCompra.find((condition.$gte || condition.$lte)?{fechaEmision : condition}:{})
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
                codigo: elem.codigo,
                formapago: formadepagoencontrada.descripcion,
                fechaemision: elem.fechaEmision,
                fechaentrega: elem.fechaEntrega,
                proveedor: {
                    _id: proveedorencontrado._id,
                    razonsocial: proveedorencontrado.razonsocial
                },
                total: elem.total,
                estado: elem.estado,
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
                subtotal: item.subtotal
            }
            items.push(newElem)
        }
        let ocDevuelta = {
            _id : oc._id,
            codigo: oc.codigo,
            formapago: formadepagoencontrada.descripcion,
            fechaemision: oc.fechaEmision,
            fechaentrega: oc.fechaEntrega,
            proveedor: proveedorencontrado.razonsocial,
            total: oc.total,
            estado: oc.estado,
            items: items
        }
        return res.send(ocDevuelta)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const ActualizarEstado = async (req, res) => {
    try {
        const {id} = req.params
        const {estado} = req.body
        let updatedOc = await OrdenDeCompra.findOne({_id : id})
        updatedOc.estado = estado
        await updatedOc.save()
        return res.json(updatedOc)
    } catch (error) {
        console.error(error)
        return res.status(400).json({error: error.message})
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

const EliminarProducto = async (req, res) => {
    try {
        const productoencontrado = await Producto.findOneAndRemove({_id: req.params.id})
        if (!productoencontrado || productoencontrado.length === 0){
            return res.status(404).json({
                error: true,
                message: "Producto no encontrado"
            })
        }
        return res.status(200).json(productoencontrado)
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
        return res.status(500).json({message : error.message})
    }
}

const AgregarProveedor = async (req, res) => {
    try {
        const proveedor = new Proveedor(req.body)
        console.log(proveedor)
        const proveedorsaved = await proveedor.save()
        console.log(proveedorsaved)
        return res.send(proveedorsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const ModificarProveedor = async (req, res) => {
    try {
       //const proveedor =  new Proveedor(req.body)
       console.log(req.body)
       const updatedProveedor = await Proveedor.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true})
       console.log(updatedProveedor)
       return res.send(updatedProveedor)
   } catch (error) {
       return res.status(500).json({message: error})
   }
}

const ModificarProducto = async (req, res) => {
    try {
        //const proveedor =  new Proveedor(req.body)
        console.log(req.body)
        const updatedProducto = await Producto.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true})
        console.log(updatedProducto)
        return res.send(updatedProducto)
    } catch (error) {
        return res.status(500).json({message: error})
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

const RecuperarUnProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById({_id: req.params.id})
        let proveedorDevuelto = {
            _id : proveedor._id,
            cuit: proveedor.cuit,
            direccion: proveedor.direccion,
            razonsocial: proveedor.razonsocial,
            email: proveedor.email,
            localidad: proveedor.localidad,
            telefono: proveedor.telefono
        }
        return res.send(proveedorDevuelto)
    } catch (error) {
        console.error(error.message)
    }
}

const RecuperarFormasDePago = async (req, res) => {
    try {
        const formasdepago = await FormaDePago.find({})
        let formasdepagodevueltas = []
        for (const elem of formasdepago) {
            let newElem = {
                _id: elem._id,
                descripcion : elem.descripcion,
                codigo : elem.codigo
            }
            formasdepagodevueltas.push(newElem)
        }
        console.log(formasdepagodevueltas)
        return res.send(formasdepagodevueltas)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
}

const RecuperarProductos = async (req, res) => {
    try {
        const productos = await Producto.find({})
        let productosdevueltos = []
        for (const elem of productos) {
            let proveedorencontrado = await Proveedor.findById(elem.proveedor)
            let marcaencontrada = await Marca.findById(elem.marca)
            let categoriaencontrada = await Categoria.findById(elem.categoria)
            let newElem = {
                _id: elem._id,
                descripcion : elem.descripcion,
                categoria : categoriaencontrada.descripcion,
                proveedor: proveedorencontrado.razonsocial,
                marca: marcaencontrada.nombre,
                codigo: elem.codigo,
                preciocompra: elem.preciocompra,
                precioventa: elem.precioventa,
                puntopedido: elem.puntopedido,
                stock: elem.stock
            }
            productosdevueltos.push(newElem)
        }
        console.log(productosdevueltos)
        return res.send(productosdevueltos)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
}

const RecuperarProductosPorProveedor = async (req, res) => {
    try {
        console.log(req.params)
        const productos = await Producto.find({proveedor : req.params.idProveedor})
        let productosdevueltos = []
        for (const elem of productos) {
            let proveedorencontrado = await Proveedor.findById(elem.proveedor)
            let marcaencontrada = await Marca.findById(elem.marca)
            let categoriaencontrada = await Categoria.findById(elem.categoria)
            let newElem = {
                _id: elem._id,
                descripcion : elem.descripcion,
                categoria : categoriaencontrada.descripcion,
                proveedor: proveedorencontrado.razonsocial,
                marca: marcaencontrada.nombre,
                codigo: elem.codigo,
                preciocompra: elem.preciocompra,
                precioventa: elem.precioventa,
                puntopedido: elem.puntopedido,
                stock: elem.stock
            }
            productosdevueltos.push(newElem)
        }
        console.log(productosdevueltos)
        return res.send(productosdevueltos)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
}

const RecuperarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find({})
        let categoriasdevueltas = []
        for (const elem of categorias) {
            let newElem = {
                _id: elem._id,
                descripcion : elem.descripcion,
            }
            categoriasdevueltas.push(newElem)
        }
        console.log(categoriasdevueltas)
        return res.send(categoriasdevueltas)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
} 

export default {GenerarOrdenDeCompra, 
    RecuperarOrdenesDeCompra, 
    AgregarMarca,
    AgregarProveedor,
    AgregarFormaDePago,
    ObtenerMarcas,
    AgregarProducto,
    AgregarLineaCompra,
    RecuperarProveedores,
    EliminarMarca,
    EliminarProveedor,
    ModificarProveedor,
    ModificarProducto,
    EliminarProducto,
    RecuperarProductos,
    RecuperarUnProveedor,
    RecuperarCategorias,
    RecuperarOrdenDeCompra,
    RecuperarFormasDePago,
    RecuperarProductosPorProveedor,
    ActualizarEstado
}