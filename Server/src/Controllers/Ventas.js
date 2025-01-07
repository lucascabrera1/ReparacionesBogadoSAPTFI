import Venta from '../Models/Venta.js'
import Cliente from '../Models/Cliente.js'
import LineaVenta from '../Models/LineaVenta.js'
import FormaDePago from '../Models/FormaDePago.js'
import Producto from '../Models/Producto.js'
import { isValidObjectId } from 'mongoose'

const validarFormatoId = (id) => {
    if (!isValidObjectId(id)) {
        return {
            isValid : false,
            message : "El id de cliente no tiene el formato correcto"
        }
    }
    return {
        isValid : true,
        message : "formato de id de cliente correcto"
    }
}

const ValidarFormatoIdYBuscarCliente = async (idCliente) => {
    if (!validarFormatoId(idCliente).isValid) return {
        error : true,
        message : validarFormatoId(idCliente).message
    }
    const clienteencontrado = await Cliente.findById({_id : idCliente})
    if (!clienteencontrado || clienteencontrado.length === 0)return {
        error: true,
        message: "Cliente no encontrado"
    }
    return {
        error : false,
        message: clienteencontrado
    }
}

const validarEmail = (email) => {
    //expresion regular para validar email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validarTelefono = (telefono) => {
    // Expresión regular para validar números de teléfono
    const regex = /^\+?\d{1,4}?[-.\s]?(\d{1,3}?[-.\s]?){1,4}\d{1,4}$/;
    return regex.test(telefono);
};

const validarDNI = (dni) => {
    // Expresión regular para validar entre 7 y 8 dígitos
    const regex = /^\d{7,8}$/;
    return regex.test(dni);
};

const validarCliente = (cliente) => {
    const { direccion, dni, email, localidad, telefono, nombreyapellido} = cliente
    if (!direccion || direccion === "") {
        return "La direccion es obligatoria y no puede ser nula"
    } if (!localidad || localidad === "") {
        return "La localidad es obligatoria y no puede ser nula"
    } if (!nombreyapellido || nombreyapellido === "") {
        return "El nombre y apellido es obligatorio y no puede ser nulo"
    } if (!validarEmail(email)) {
        return "El email es obligatorio y debe tener el formato correcto"
    } if (!validarTelefono(telefono)) {
        return "El teléfono es obligatorio y debe tener el formato correcto"
    } if (!validarDNI(dni)) {
        return "El dni es obligatorio y debe tener el formato correcto"
    }
    return true
}

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
            const {cliente, formaDePago, fechaEmision, codigo, total, _id} = elem
            let {nombreyapellido} = await Cliente.findById(cliente)
            let {descripcion} = await FormaDePago.findById(formaDePago)
            let detalles = []
            for (const newItem of elem.detalles){
                let {producto, cantidad, subtotal, _id} = await LineaVenta.findById(newItem)
                let {descripcion, precioventa} = await Producto.findById(producto)
                let newLv = {
                    _id,
                    producto : descripcion,
                    cantidad,
                    precioventa,
                    subtotal
                }
                detalles.push(newLv)
            }
            let newVenta = {
                _id,
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

const RecuperarVenta = async (req, res, next) => {
    try {
        const venta = await Venta.findById({_id : req.params.id})
        if (!venta){
            return res.status(404).json({
                error: true,
                message: "Venta no encontrada"
            })
        }
        const {cliente, formaDePago, fechaEmision, codigo, total, _id} = venta
        let {nombreyapellido} = await Cliente.findById(cliente)
        let {descripcion} = await FormaDePago.findById(formaDePago)
        let detalles = []
        for (const newItem of venta.detalles){
            let {producto, cantidad, subtotal, _id} = await LineaVenta.findById(newItem)
            let {descripcion, precioventa} = await Producto.findById(producto)
            let newLv = {
                _id,
                producto : descripcion,
                cantidad,
                precioventa,
                subtotal
            }
            detalles.push(newLv)
        }
        let newVenta = {
            _id,
            codigo,
            fechaEmision,
            formaDePago : descripcion,
            cliente : nombreyapellido,
            total,
            detalles
        }
        return res.send(newVenta)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const AgregarCliente = async (req, res) => {
    try {
        if (validarCliente(req.body) === true) {
            const cliente = new Cliente(req.body)
            const clientesaved = await cliente.save()
            return res.status(200).json(clientesaved)
        } else {
            return res.status(400).json({
                error: true,
                message: validarCliente(req.body)
            })
        }
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const ModificarCliente = async (req, res) => {
    try {
        const {id} = req.params
        const result =  await ValidarFormatoIdYBuscarCliente(id)
        if (result.error) return res.status(400).json({
            error : true,
            message : result.message
        })
        if (validarCliente(req.body) === true) {
            const updatedCliente = await Cliente.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true})
            return res.status(200).json(updatedCliente)
            //return res.status(200).json(req.body)
        } else {
            return res.status(400).json({
                error: true,
                message: validarCliente(req.body)
            })
        }
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

const EliminarCliente = async (req, res) => {
    try {
        const {id} = req.params
        const result =  await ValidarFormatoIdYBuscarCliente(id)
        if (result.error) return res.status(400).json({
            error : true,
            message : result.message
        })
        const removedCliente = await Cliente.findOneAndRemove({_id: id})
        return res.status(200).json(removedCliente)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error})
    }
}

const RecuperarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find({})
        let clientesdevueltos = []
        for (const elem of clientes) {
            /* let newElem = {
                _id: elem._id,
                nombreyapellido : elem.nombreyapellido,
                email : elem.email,
                telefono : elem.telefono,
                localidad : elem.localidad,
                dni : elem.dni,
                direccion : elem.direccion
            }
            clientesdevueltos.push(newElem) */
            clientesdevueltos.push(elem)
        }
        return res.send(clientesdevueltos)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: error})
    }
}

export default {AgregarVenta, 
    RecuperarVentas, 
    AgregarCliente, 
    ModificarCliente, 
    EliminarCliente, 
    RecuperarClientes,
    RecuperarVenta
}