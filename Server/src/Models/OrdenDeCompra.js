import mongoose, { Schema } from "mongoose";

const schemaOrdenCompra = new mongoose.Schema({
    codigo : {
        type: Number,
        required: true,
        unique : true
    },
    fechaEmision: {
        type: Date,
        required:true
    },
    fechaEntrega: {
        type: Date,
        required:true
    },
    formaDePago: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FormaDePago",
        required:true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LineaCompra",
        required: true
    }],
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proveedor",
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    estado : {
        type: String,
        Enumerator : { value: ["Pendiente", "Confirmada", "Rechazada", "Entregada"]},
        default: "Pendiente",
        required: true
    }
})

export default mongoose.model('OrdenDeCompra', schemaOrdenCompra)