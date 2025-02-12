import { Schema, model } from "mongoose";

const schemaModelo = new Schema({
    anio : {
        type: Number,
        required: true
    },
    nombre : {
        type: String,
        required: true
    }
})

export default model('Modelo', schemaModelo)