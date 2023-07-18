import mongoose from "mongoose";

const schemaProveedor = new mongoose.Schema({
    cuit:{
        type: Number, 
        required: true, 
        unique: true
    },
    direccion:{
        type: String,
        required: true
    },
    razonsocial: {
        type: String,
        required: true
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
    }

})

export default mongoose.model('Proveedor', schemaProveedor)