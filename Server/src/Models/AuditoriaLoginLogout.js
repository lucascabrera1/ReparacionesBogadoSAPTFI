import {model, Schema} from 'mongoose';

const auditoriaSesionSchema = new Schema({
  user: { type: String, required: true },
  action: { type: String, enum: ['login', 'logout'], required: true },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
});

export default model('AuditoriaSesion', auditoriaSesionSchema);