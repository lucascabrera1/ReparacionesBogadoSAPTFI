import mongoose from 'mongoose'

const schemaMarca = new mongoose.Schema({
    nombre: {
        type: String, 
        required: true, 
        unique: true
    },
    paisorigen: {
        type: String, 
        required: false
    },
    modelos : [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Modelo'
    }]
})

export default mongoose.model('Marca', schemaMarca)