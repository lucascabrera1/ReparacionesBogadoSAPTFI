import Proveedor from "../Models/Proveedor.js";
import FormaDePago from "../Models/FormaDePago.js";
import OrdenDeCompra from "../Models/OrdenDeCompra.js";
import Producto from "../Models/Producto.js";
import LineaCompra from "../Models/LineaCompra.js";
import Remito from "../Models/Remito.js";
import { isValidObjectId } from "mongoose";

function isValidDateFormat(date) {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return dateRegex.test(date);
}

export const ValidarOrdenDeCompra = async (req, res, next) => {
    try {
        const today = new Date()
        const {fechaEmision, fechaEntrega, formaDePago, proveedor, detalles, codigo, total} = req.body
        if (!fechaEmision || fechaEmision>today || !isValidDateFormat(fechaEmision)) {
            return res.status(400).json({
                error: true,
                message: "La fecha de emisión es obligatoria y debe ser anterior a la fecha actual"
            })
        }
        if (!fechaEntrega || fechaEntrega<= today || !isValidDateFormat(fechaEmision)) {
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
        if (!(isValidObjectId(formaDePago))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de forma de pago no válido" 
            });
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
        if (!(isValidObjectId(proveedor))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de proveedor no válido" 
            });
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
                if (!(isValidObjectId(detalles[i].id_producto))) {
                    return res.status(400).json({ 
                        error: true,
                        message: "Formato de ID de producto no válido" 
                    });
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
            }
        }
        console.log("validacion correcta")
        next()
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

export const ValidarRemitoDeCompra = async (req, res, next) => {
    try {
        const today = new Date()
        const {fechaEmision, proveedor, detalles, ordenCompra} = req.body
        //const idproveedor =  {_id} = proveedor
        console.log(proveedor)
        if (!fechaEmision || fechaEmision>today || !isValidDateFormat(fechaEmision)) {
            return res.status(400).json({
                error: true,
                message: "La fecha de emisión es obligatoria y debe ser anterior a la fecha actual"
            })
        }
        if(!proveedor) {
            return res.status(400).json({
                error: true,
                message: "El proveedor es obligatorio"
            })
        }
        if (!(isValidObjectId(proveedor))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de proveedor no válido" 
            });
        }
        const proveedorencontrado = await Proveedor.findById({_id: proveedor})
        console.log('proveedor: ' + proveedorencontrado)
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
        if (!ordenCompra) {
            return res.status(400).json({ 
                error: true,
                message: "la orden de compra es obligatoria" 
            });
        }
        if (!(isValidObjectId(ordenCompra))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de orden de compra no válido" 
            });
        }
        const remito_oc = await Remito.findOne({ordenCompra : ordenCompra})
        if (remito_oc) return res.status(409).json({
            error : true,
            message : `ya existe un remito para esa orden de compra, si necesita volver a ingresar un remito elimine el remito ${remito_oc._id}`
        })
        const oc = await OrdenDeCompra.findById({_id: ordenCompra})
        if (!oc) {
            return res.status(404).json({
                error : true,
                message : `la orden de compra ${ordenCompra} no existe`
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
                if (!(isValidObjectId(detalles[i].id_producto))) {
                    return res.status(400).json({ 
                        error: true,
                        message: "Formato de ID de producto no válido" 
                    });
                }
                if (!(isValidObjectId(detalles[i].lineaCompra))) {
                    return res.status(400).json({ 
                        error: true,
                        message: "Formato de ID de línea de compra no válido" 
                    });
                }
                const lce = await LineaCompra.findById({_id : detalles[i].lineaCompra})
                if (!lce){
                    return res.status(409).json({
                        error: true,
                        message: "Línea de compra inexistente"
                    })
                }
                if(!detalles[i].cantidad || isNaN(detalles[i].cantidad) || detalles[i].cantidad.length === 0 || detalles[i].cantidad === 0 || !Number.isInteger(detalles[i].cantidad)) {
                    return res.status(400).json({
                        error: true,
                        message: "La cantidad ingresada de la línea de remito debe ser un valor numérico entero mayor a 0"
                    })
                }
            }
        }
        console.log("validacion correcta")
        next()
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}