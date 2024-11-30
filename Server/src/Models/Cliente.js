import { model, Schema } from "mongoose";

const schemaCliente = new Schema({
    direccion: {
        type: String, 
        required: true
    },
    dni : {
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    localidad:{
        type: String,
        required: true
    },
    telefono:{
        type: String,
        required: true
    },
    nombreyapellido: {
        type: String,
        required: true
    }
})

export default model('cliente', schemaCliente)