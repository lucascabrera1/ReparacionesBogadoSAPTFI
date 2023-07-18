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
    }
})

export default mongoose.model('Marca', schemaMarca)