import mongoose from "mongoose";

const schemaCategoria = new mongoose.Schema({
    descripcion: {
        type: String, 
        unique: true, 
        required: true
    }
})

export default mongoose.model('Categoria', schemaCategoria)