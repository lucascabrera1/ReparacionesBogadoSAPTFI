import mongoose from "mongoose";

const schemaRemito = new mongoose.Schema({
    fechaEmision: {
        type: Date,
        required:true
    },
    proveedor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
    },
    ordenCompra : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrdenDeCompra',
        required: true,
        unique: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LineaRemito",
        required: true
    }]
})

export default mongoose.model('Remito', schemaRemito)