import mongoose from "mongoose";

const schemaLineaCompra = new mongoose.Schema({
    cantidad:{
        type: Number,
        required: true
    },
    faltante:{
        type: Number,
        required: true
    },
    producto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    subtotal:{
        type: Number,
        required: true
    }
})

export default mongoose.model('LineaCompra', schemaLineaCompra)