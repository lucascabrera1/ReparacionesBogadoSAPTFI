import { Schema, model } from "mongoose";

export const ROLES = ["admin", "Encargado de Compras", "Encargado de Ventas", "user"]

const schemaRole = new Schema({
    nombre: String,
    descripcion: String
}, {
    timestamps: true,
    versionKey: false
})

export default model('Role', schemaRole)