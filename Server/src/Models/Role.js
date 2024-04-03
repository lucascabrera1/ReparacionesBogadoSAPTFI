import { Schema, model } from "mongoose";

const schemaRole = new Schema({
    nombre: String,
    descripcion: String
}, {
    timestamps: true,
    versionKey: false
})

export default model('Role', schemaRole)