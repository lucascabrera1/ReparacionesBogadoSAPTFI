import Proveedor from "../Models/Proveedor.js";
import FormaDePago from "../Models/FormaDePago.js";
import OrdenDeCompra from "../Models/OrdenDeCompra.js";
import Producto from "../Models/Producto.js";
import LineaCompra from "../Models/LineaCompra.js";
import Remito from "../Models/Remito.js";
import Venta from "../Models/Venta.js";
import { isValidObjectId } from "mongoose";
import Cliente from "../Models/Cliente.js";
import Marca from "../Models/Marca.js";
import Modelo from "../Models/Modelo.js";
import Presupuesto from "../Models/Presupuesto.js";
import User from '../Models/User.js'

function tieneDuplicados(arr) {
    const elementos = new Set();
    for (const elemento of arr) {
        if (elementos.has(elemento.lineaCompra)) {
            return true; // Hay un duplicado
        }
        elementos.add(elemento.lineaCompra);
    }
    return false; // No hay duplicados
}

export function isValidDateFormat(date) {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return dateRegex.test(date);
}

export function convertirFecha(fechaStr) {
    // Crear un objeto Date a partir de la cadena de entrada
    const fecha = new Date(fechaStr);
    // Obtener los componentes de la fecha
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const day = String(fecha.getDate()).padStart(2, '0');
    // Formatear la fecha como YYYY-MM-DD
    return `${year}-${month}-${day}`;
}

export function formatNumber(input) {
    // Convertir el string a número
    const number = parseFloat(input);
    
    if (isNaN(number)) {
      throw new Error('El valor proporcionado no es un número válido.');
    }
  
    // Formatear el número
    return number
      .toFixed(2) // Asegurar que tenga 2 decimales
      .replace('.', ',') // Reemplazar el punto decimal por una coma
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agregar puntos como separadores de miles
  }

  function esEntero(valor) {
    if (typeof valor === 'number' && Number.isInteger(valor)) {
      return true;
    }
    if (typeof valor === 'string' && valor.trim() !== '' && !isNaN(valor)) {
      return Number.isInteger(Number(valor));
    }
    return false;
  }

export const ValidarOrdenDeCompra = async (req, res, next) => {
    try {
        const today = convertirFecha(new Date())
        const {fechaEmision, fechaEntrega, formaDePago, proveedor, detalles, codigo, total} = req.body
        //const fecha = new Date(fechaEmision)
        const fecha = convertirFecha(fechaEmision)
        if (!fecha || fecha>today || !isValidDateFormat(fecha)) {
            return res.status(400).json({
                error: true,
                message: "La fecha de emisión es obligatoria y debe ser anterior a la fecha actual"
            })
        }
        if (!fechaEntrega || fechaEntrega<= today || !isValidDateFormat(fechaEntrega)) {
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
            return res.status(400).json({
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
            return res.status(400).json({
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
                    return res.status(404).json({
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
                        message: "El subtotal debe ser un valor numérico mayor a 0"
                    })
                }
            }
        }
        /* return res.status(202).json({
            error: false,
            message: "validación correcta"
        }) */
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
        const today = convertirFecha(new Date())
        const {fechaEmision, proveedor, detalles, ordenCompra} = req.body
        const fecha = convertirFecha(fechaEmision)
        if (!fechaEmision || !isValidDateFormat(fecha) || fecha>today) {
            return res.status(400).json({
                error: true,
                message: `La fecha de emisión es obligatoria y debe ser anterior a la fecha actual ${today}`,
                fechaEmision,
                fecha
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
        //valido cada elemento del array detalles del remito de compra
        if (detalles) {
            for (let i=0; i<detalles.length; i++) {
                if (!detalles[i].lineaCompra) {
                    return res.status(400).json({ 
                        error: true,
                        message: "el id de la línea de compra asociada es obligatorio" 
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
                    return res.status(404).json({
                        error: true,
                        message: "Línea de compra inexistente"
                    })
                }
                if(!detalles[i].cantidadIngresada || 
                    isNaN(detalles[i].cantidadIngresada) || 
                    detalles[i].cantidadIngresada.length === 0 || 
                    detalles[i].cantidadIngresada === 0 || 
                    !Number.isInteger(detalles[i].cantidadIngresada)
                ) {
                    return res.status(400).json({
                        error: true,
                        message: "La cantidad ingresada de la línea de remito debe ser un valor numérico entero mayor a 0"
                    })
                }
            }
            let td = tieneDuplicados(detalles)
            if (td) {
                return res.status(409).json({
                    error: true,
                    message: "hay 2 líneas de remito que hacen referencia a una misma línea de compra"
                })
            }
        }
        next()
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

export const ValidarVenta = async (req, res, next) => {
    try {
        const today = convertirFecha(new Date())
        const {fechaEmision, formaDePago, cliente, detalles, codigo, total} = req.body
        //const fecha = new Date(fechaEmision)
        const fecha = convertirFecha(fechaEmision)
        if (!fecha || fecha>today || !isValidDateFormat(fecha)) {
            return res.status(400).json({
                error: true,
                message: "La fecha de emisión es obligatoria y debe ser anterior a la fecha actual"
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
            return res.status(400).json({
                error: true,
                message: "La forma de pago no existe"
            })
        }
        if(!cliente) {
            return res.status(400).json({
                error: true,
                message: "El cliente es obligatorio"
            })
        }
        if (!(isValidObjectId(cliente))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de cliente no válido" 
            });
        }
        const clienteencontrado = await Cliente.findById({_id: cliente})
        if (!clienteencontrado) {
            return res.status(400).json({
                error: true,
                message: `el cliente ${cliente} no existe`
            })
        }
        if (!detalles || detalles.length === 0) {
            return res.status(400).json({
                error: true,
                message: "La venta debe poseer al menos una línea de venta"
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
        const venta = await Venta.findOne({codigo: codigo})
        if (venta) {
            return res.status(409).json({
                error : true,
                message : `ya existe una venta con el codigo ${codigo}`
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
                    return res.status(404).json({
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
                if (!detalles[i].precioventa || isNaN(detalles[i].precioventa) || detalles[i].precioventa.length === 0 || detalles[i].precioventa === 0) {
                    return res.status(400).json({
                        error: true,
                        message: "El precio de venta debe ser un valor numérico mayor a 0"
                    })
                }
                if(!detalles[i].cantidad || isNaN(detalles[i].cantidad) || detalles[i].cantidad.length === 0 || detalles[i].cantidad === 0 || !Number.isInteger(detalles[i].cantidad)) {
                    return res.status(400).json({
                        error: true,
                        message: "La cantidad del producto debe ser un valor numérico entero mayor a 0"
                    })
                }
                if (detalles[i].cantidad > productoencontrado.stock) {
                    return res.status(409).json({
                        error: true,
                        message: `para el producto ${productoencontrado._id }, el stock disponible: ${productoencontrado.stock}`
                    })
                }
                if (!detalles[i].subtotal || isNaN(detalles[i].subtotal) || detalles[i].subtotal.length === 0 || detalles[i].subtotal === 0) {
                    return res.status(400).json({
                        error: true,
                        message: "El subtotal debe ser un valor numérico mayor a 0"
                    })
                }
            }
        }
        /* return res.status(202).json({
            error: false,
            message: "validación de venta exitosa"
        }) */
        next()
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

export const ValidarPresupuesto = async (req, res, next) => {
    try {
        const today = convertirFecha(new Date())
        const {codigo, cliente, falla, fechaIngreso, marca, modelo} = req.body
        const fechaIngresoConvertida = convertirFecha(fechaIngreso)
        if (!codigo || codigo.length === 0 || !esEntero(codigo)) {
            return res.status(400).json({
                error : true,
                message : "el codigo es obligatorio"
            })
        }
        const pres = await Presupuesto.findOne({codigo: codigo})
        console.log("presupuesto encontrado")
        console.log(pres)
        console.log("fin presupuesto encontrado")
        console.log("fecha ingreso inicio")
        console.log(fechaIngreso)
        console.log("fechaIngreso fin")
        if (pres) {
            return res.status(409).json({
                error : true,
                messsage : `El presupuesto con codigo ${codigo} ya existe`
            })
        }
        if (!falla || falla.length === 0) {
            return res.status(400).json({
                error : true,
                message : "la falla es obligatoria"
            })
        }
        if (!fechaIngresoConvertida || !isValidDateFormat(fechaIngresoConvertida)) {
            return res.status(400).json({
                error: true,
                message: "La fecha de ingreso es obligatoria"
            })
        }
        if (!marca) {
            return res.status(400).json({
                error: true,
                message: "La marca es obligatoria"
            })
        }
        if (!(isValidObjectId(marca))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de marca no válido" 
            });
        }
        const marcae = await Marca.findById({_id: marca})
        if (!marcae) {
            return res.status(400).json({
                error: true,
                message: "La marca no existe"
            })
        }
        if(!cliente) {
            return res.status(400).json({
                error: true,
                message: "El cliente es obligatorio"
            })
        }
        if (!(isValidObjectId(cliente))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de cliente no válido" 
            });
        }
        const clienteencontrado = await User.findById({_id: cliente})
        if (!clienteencontrado) {
            return res.status(400).json({
                error: true,
                message: `el cliente ${cliente} no existe`
            })
        }
        if(!modelo) {
            return res.status(400).json({
                error: true,
                message: "El modelo es obligatorio"
            })
        }
        if (!(isValidObjectId(modelo))) {
            return res.status(400).json({ 
                error: true,
                message: "Formato de ID de modelo no válido" 
            });
        }
        const modeloencontrado = await Modelo.findById({_id: modelo})
        if (!modeloencontrado) {
            return res.status(400).json({
                error: true,
                message: `el modelo ${modelo} no existe`
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}