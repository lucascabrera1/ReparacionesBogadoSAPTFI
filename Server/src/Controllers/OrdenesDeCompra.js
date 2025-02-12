import OrdenDeCompra from '../Models/OrdenDeCompra.js'
import FormaDePago from '../Models/FormaDePago.js'
import LineaCompra from '../Models/LineaCompra.js'
import Marca from '../Models/Marca.js'
import Producto from '../Models/Producto.js'
import Proveedor from '../Models/Proveedor.js'
import Categoria from '../Models/Categoria.js'
import dotenv from 'dotenv'
import SendMail from '../Utils/SendMail.js'
dotenv.config({path: '../.env'})
import {convertirFecha, formatNumber} from '../Middlewares/validateEntryData.js'
import Modelo from '../Models/Modelo.js'

const validarAnio = (aniostring) => {
    const anio = parseInt(aniostring)
    if (!anio) return {
        error : true,
        message : "Indique el año"
    }
    if (Number.isInteger(anio) && anio >= 2007 && anio <= 2025) return {
        error : false,
        message: "año correcto"
    }
    return {
        error : true,
        message : "El año debe ser un numero entero y debe ser entre 2007 y 2025"
    }
}

const validarModelo = async (modelo, anio) => {
    try {
        if (!modelo) return {
            error : true,
            message: "Campo vacío"
        }
        const modelfounded = await Modelo.findOne({nombre : modelo})
        if (modelfounded) return {
            error : true,
            message : `El modelo ${modelo} ya existe`
        }
        const resultanio = validarAnio(anio)
        if (resultanio.error) return {
            error : true,
            message : resultanio.message
        }
        return {
            error : false,
            message : "modelo agregado correctamente"
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message : error
        })
    }
}


const GenerarOrdenDeCompra = async(req, res, next) => {
    try {
        let detalles = []
        for(const elem of req.body.detalles) {
            let {preciocompra, descripcion} = await Producto.findById(elem.id_producto)
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
            let modelos = []
            for (const model of elem.modelos) {
                const {anio, nombre} = await Modelo.findById(model)
                let newModel = {anio, nombre}
                modelos.push(newModel)
            }
            let newElem = {
                _id: elem._id,
                paisorigen : elem.paisorigen,
                nombre: elem.nombre,
                modelos
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
        const marcasaved = await marca.save()
        return res.send(marcasaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const AgregarModelo = async (req, res) => {
    try {
        const {nombre, anio} = req.body
        const result = await validarModelo(nombre, anio)
        if (result.error) return res.status(400).json({
            error : true,
            message : result.message
        })
        const modelo = new Modelo(req.body)
        const newmodel = await modelo.save()
        await Marca.findByIdAndUpdate(
            {_id : req.params.idMarca},
            {$push : {'modelos' : newmodel._id}},
            {new : true},
        )
        return res.status(200).json(newmodel)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const EliminarModelo = async (req, res) => {
    try {
        const modelfounded = await Modelo.findOneAndRemove({_id : req.params.id})
        const marca = await Marca.findByIdAndUpdate(
            {_id : req.params.idMarca},
            {$pull : {modelos : req.params.id}},
            {new: true}
        )
        if (!modelfounded || modelfounded.length === 0){
            return res.status(404).json({
                error: true,
                message: "Modelo no encontrado"
            })
        }

        return res.status(200).json(modelfounded)
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
        const fpsaved = await fp.save()
        return res.send(fpsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const AgregarProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body)
        const productosaved = await producto.save()
        return res.send(productosaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message})
    }
}

const AgregarProveedor = async (req, res) => {
    try {
        const proveedor = new Proveedor(req.body)
        const proveedorsaved = await proveedor.save()
        return res.send(proveedorsaved)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : message.error})
    }
}

const ModificarProveedor = async (req, res) => {
    try {
       const updatedProveedor = await Proveedor.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true})
       return res.send(updatedProveedor)
   } catch (error) {
       return res.status(500).json({message: error})
   }
}

const ModificarProducto = async (req, res) => {
    try {
        const updatedProducto = await Producto.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true})
        return res.send(updatedProducto)
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

const AgregarLineaCompra = async (req, res) => {
    try {
        const lc = new LineaCompra(req.body)
        const lcsaved = await lc.save()
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
        return res.send(proveedoresdevueltos)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
}

const RecuperarModelos = async (req, res) => {
    try {
        const marca = await Marca.findById({_id : req.params.idMarca})
        if (!marca){
            return res.status(404).json({
                error: true,
                message: "Marca no encontrada"
            })
        }
        let modelos = []
        for (const elem of marca.modelos) {
            const newElem = await Modelo.findById(elem)
            modelos.push(newElem)
        }
        return res.send(modelos)
    } catch (error) {
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
        return res.send(productosdevueltos)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
}

const RecuperarProductosPorProveedor = async (req, res) => {
    try {
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
    EliminarModelo,
    RecuperarProductos,
    RecuperarUnProveedor,
    RecuperarCategorias,
    RecuperarOrdenDeCompra,
    RecuperarFormasDePago,
    RecuperarProductosPorProveedor,
    RecuperarModelos,
    ActualizarEstado,
    AgregarModelo
}