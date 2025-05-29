import { model, Schema } from "mongoose";

console.log("entra a la entidad auditoria presupuestos")

const schemaAuditoriaPresupuestos = new Schema({
    user: { type: String, required: true }, // ID o nombre del usuario que hizo la acción
    action: { type: String, enum: ['create', 'update', 'delete'], required: true },
    collectionname: { type: String, required: true },
    documentId: { type: Schema.Types.ObjectId, required: true },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
})

export default model('auditoriapresupuesto', schemaAuditoriaPresupuestos)