import Proveedor from "../Models/Proveedor.js";
import FormaDePago from "../Models/FormaDePago.js";
import OrdenDeCompra from "../Models/OrdenDeCompra.js";
import Producto from "../Models/Producto.js";

export const ValidarOrdenDeCompra = async (req, res, next) => {
    try {
        const today = new Date()
        const {fechaEmision, fechaEntrega, formaDePago, proveedor, detalles, codigo, total} = req.body
        if (!fechaEmision || fechaEmision>today) {
            return res.status(400).json({
                error: true,
                message: "La fecha de emisión es obligatoria y debe ser anterior a la fecha actual"
            })
        }
        if (!fechaEntrega || fechaEntrega<= today) {
            return res.status(400).json({
                error: true,
                message: "La fecha de entrega es obligatoria y debe ser posterior a la fecha actual"
            })
        }
        if (!formaDePago) {
            return res.status(400).json({
                error: true,
                message: "La forma de pago es obligatoria"
            })
        }
        const fpe = await FormaDePago.findById({_id: formaDePago})
        if (!fpe) {
            return res.status(404).json({
                error: true,
                message: "La forma de pago no existe"
            })
        }
        if(!proveedor) {
            return res.status(400).json({
                error: true,
                message: "El proveedor es obligatorio"
            })
        }
        const proveedorencontrado = await Proveedor.findById({_id: proveedor})
        if (!proveedorencontrado) {
            return res.status(404).json({
                error: true,
                message: "El proveedor no existe"
            })
        }
        if (!detalles || detalles.length === 0) {
            return res.status(400).json({
                error: true,
                message: "La orden de compra debe poseer al menos una línea de compra"
            })
        }
        if (!codigo || codigo<1) {
            return res.status(400).json({
                error: true,
                message: "el código es obligatorio y debe ser mayor a 0"
            })
        }
        if (!total || total === 0) {
            return res.status(400).json({
                error: true,
                message: "el total es obligatorio y debe ser mayor a 0"
            })
        }
        const oc = await OrdenDeCompra.findOne({codigo: codigo})
        if (oc) {
            return res.status(409).json({
                error : true,
                message : `ya existe una orden de compra con el codigo ${codigo}`
            })
        }
        //valido cada elemento del array detalles de la orden de compra
        if (detalles) {
            for (let i=0; i<detalles.length; i++) {
                if (!detalles[i].id_producto || detalles[i].id_producto.length === 0) {
                    return res.status(400).json({
                        error: true,
                        message: "el producto es obligatorio"
                    })
                }
                const productoencontrado = await Producto.findById({_id : detalles[i].id_producto})
                if (!productoencontrado){
                    return res.status(409).json({
                        error: true,
                        message: "Producto inexistente"
                    })
                }
                if(!detalles[i].descripcion || detalles[i].descripcion.length === 0) {
                    return res.status(400).json({
                        error: true,
                        message: "La descripción del producto es obligatoria y debe tener al menos un caracter"
                    })
                }
                if (!detalles[i].preciocompra || isNaN(detalles[i].preciocompra) || detalles[i].preciocompra.length === 0 || detalles[i].preciocompra === 0) {
                    return res.status(400).json({
                        error: true,
                        message: "El precio de compra debe ser un valor numérico mayor a 0"
                    })
                }
                if(!detalles[i].cantidad || isNaN(detalles[i].cantidad) || detalles[i].cantidad.length === 0 || detalles[i].cantidad === 0 || !Number.isInteger(detalles[i].cantidad)) {
                    return res.status(400).json({
                        error: true,
                        message: "La cantidad del producto debe ser un valor numérico entero mayor a 0"
                    })
                }
                if (!detalles[i].subtotal || isNaN(detalles[i].subtotal) || detalles[i].subtotal.length === 0 || detalles[i].subtotal === 0) {
                    return res.status(400).json({
                        error: true,
                        message: "El precio de compra debe ser un valor numérico mayor a 0"
                    })
                }
                console.log("volvio a pasar por detalles.element")
            }
        }
        /* detalles.forEach(async (element) =>  {
            console.log("un elemento")
            if (!element.id_producto || element.id_producto.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "el producto es obligatorio"
                })
            }
            const productoencontrado = await Producto.findById({_id : element.id_producto})
            if (!productoencontrado){
                return res.status(409).json({
                    error: true,
                    message: "Producto inexistente"
                })
            }
            if(!element.descripcion || element.descripcion.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "La descripción del producto es obligatoria y debe tener al menos un caracter"
                })
            }
            if (!element.preciocompra || isNaN(element.preciocompra) || element.preciocompra.length === 0 || element.preciocompra === 0) {
                return res.status(400).json({
                    error: true,
                    message: "El precio de compra debe ser un valor numérico mayor a 0"
                })
            }
            if(!element.cantidad || isNaN(element.cantidad) || element.cantidad.length === 0 || element.cantidad === 0 || !Number.isInteger(element.cantidad)) {
                return res.status(400).json({
                    error: true,
                    message: "La cantidad del producto debe ser un valor numérico entero mayor a 0"
                })
            }
            if (!element.subtotal || isNaN(element.subtotal) || element.subtotal.length === 0 || element.subtotal === 0) {
                return res.status(400).json({
                    error: true,
                    message: "El precio de compra debe ser un valor numérico mayor a 0"
                })
            }
            console.log("volvio a pasar por detalles.element")
        }); */
        console.log("validacion correcta")
        next()
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

