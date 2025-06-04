import {model, Schema} from "mongoose"
import AuditoriaPresupuestos from "./AuditoriaPresupuestos.js";
import { getUserId } from "../Utils/request-context.js";

const schemaPresupuesto = new Schema ({
    //al ingresar un equipo al taller siempre se deberan registrar estos campos
    codigo : {
        type: Number,
        unique : true,
        required : true
    },
    cliente : {
        type: Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    estado : {
        type : String,
        Enumerator : {value : ["Ingresado", "Presupuestado", "Confirmado", "Descartado", "Reparado", 
            "Reparado y retirado", "Descartado y retirado"]},
        required : true,
        default : "Ingresado"
    },
    falla : {
        type : String,
        required: true
    },
    fechaIngreso : {
        type: Date,
        required: true
    },
    marca : {
        type: Schema.Types.ObjectId,
        ref : 'Marca',
        required : true
    },
    modelo : {
        type : Schema.Types.ObjectId,
        ref : "Modelo",
        required : true
    },
    //una vez diagnosticado se registran los siguientes atributos
    diagnostico : {
        type: String
    },
    precioAproximado : {
        type: Number
    },
    fechaAproxEntrega : {
        type : Date
    },
    //una vez confirmada y efectuada la reparación se registran
    fechaEntrega: {
        type : Date
    },
    precio: {
        type: Number
    },
    //una vez retirado se registran
    fechaRetiro : {
        type : Date
    },
    formaDePago : {
        type : Schema.Types.ObjectId,
        ref : 'FormaDePago'
    }
    
})

schemaPresupuesto.pre(['findOneAndUpdate', 'findOneAndDelete'], async function (next) {
  this._original = await this.model.findOne(this.getQuery()).lean();
  next();
});

schemaPresupuesto.post('findOneAndUpdate', async function (res) {
  if (res && this._original) {
    console.log("this y res")
    console.log(this)
    console.log(res)
    console.log("fin this y res")
    const newauditoriapresupuesto = await AuditoriaPresupuestos.create({
      user: getUserId() || 'sistema', // Pasás el usuario como opción
      action: 'update',
      collectionname: 'User',
      documentId: res._id,
      before: this._original,
      after: res.toObject()
    });
    console.log("inicio newauditoriapresupuesto")
    console.log(newauditoriapresupuesto)
    console.log("fin newauditoriapresupuesto")
  }
});

/* schemaAuditoriaPresupuestos.post('findOneAndDelete', async function (res) {
  if (res) {
    await AuditLog.create({
      user: this.options._user || 'sistema',
      action: 'delete',
      collectionname: 'Cliente',
      documentId: res._id,
      before: res.toObject(),
      after: null
    });
  }
}); */

// Middleware para "create"
schemaPresupuesto.post('save', async function () {
    console.log("this")
    console.log(this)
    console.log("fin this")
    const newauditoriapresupuesto = await AuditoriaPresupuestos.create({
        user: getUserId() || 'sistema', // `_user` debe ser seteado antes de guardar
        action: 'create',
        collectionname: 'User',
        documentId: this._id,
        before: null,
        after: this.toObject()
    });
    console.log("inicio newauditoriapresupuesto")
    console.log(newauditoriapresupuesto)
    console.log("fin newauditoriapresupuesto")
});

export default model('Presupuesto', schemaPresupuesto)