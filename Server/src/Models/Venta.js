import { Schema, model } from "mongoose";

const schemaVenta = new Schema({
    codigo : {
        type: Number,
        required: true,
        unique : true
    },
    fechaEmision: {
        type: Date,
        required:true
    },
    formaDePago: {
        type: Schema.Types.ObjectId,
        ref: "FormaDePago",
        required:true
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: "LineaVenta",
        required: true
    }],
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },
    total: {
        type: Number,
        required: true
    }
})

export default model('Venta', schemaVenta)