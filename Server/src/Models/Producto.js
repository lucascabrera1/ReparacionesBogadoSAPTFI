import mongoose from 'mongoose'

const schemaProducto = new mongoose.Schema({
    descripcion: {
        type: String, 
        required: true, 
        unique: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Categoria",
        required: true 
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Proveedor",
        required: true 
    },
    marca: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Marca",
        required: true 
    },
    codigo: {
        type: Number, 
        required: true, 
        unique: true
    },
    preciocompra: {
        type: Number, 
        required: true
    },
    precioventa: {
        type: Number, 
        required: true
    },
    puntopedido: {
        type: Number, 
        required: true
    },
    stock: {
        type: Number, 
        required: true
    }
})

export default mongoose.model('Producto', schemaProducto)