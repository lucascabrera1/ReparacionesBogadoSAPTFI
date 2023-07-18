import mongoose from "mongoose";

const schemaFormaPago = new mongoose.Schema({
    descripcion : {
        type: String,
        required: true,
        unique: true
    },
    codigo: {
        type: Number,
        require: true,
        unique: true
    }
})

export default mongoose.model('Forma', schemaFormaPago)