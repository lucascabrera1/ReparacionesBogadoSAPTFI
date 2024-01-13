import mongoose from "mongoose";

const schemaOrdenCompra = new mongoose.Schema({
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
        ref: "Proveedor",
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
    }
})

export default mongoose.model('OrdenDeCompra', schemaOrdenCompra)