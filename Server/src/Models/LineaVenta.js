import {model, Schema} from "mongoose";

const schemaLineaVenta = new Schema({
    cantidad:{
        type: Number,
        required: true
    },
    producto:{
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    subtotal:{
        type: Number,
        required: true
    }
})

export default model('LineaVenta', schemaLineaVenta)