import {model, Schema} from "mongoose"

const schemaPresupuesto = new Schema ({
    //al ingresar un equipo al taller siempre se deberan registrar estos campos
    codigo : {
        type: Number,
        unique : true,
        required : true
    },
    cliente : {
        type: Schema.Types.ObjectId,
        ref : "Cliente",
        required : true
    },
    estado : {
        type : String,
        Enumerator : {value : ["A Diagnosticar", "Presupuestado", "Confirmado", "Descartado", "Reparado"]},
        required : true,
        default : "A Diagnosticar"
    },
    falla : {
        type : String,
        required: true
    },
    fechaIngreso : {
        type: Date,
        required: true
    },
    modelo : {
        type : Schema.Types.ObjectId,
        ref : "Modelo",
        required : true
    },
    //una vez diagnosticado se registran los siguientes atributos
    observaciones : {
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
    }
})

export default model('Presupuesto', schemaPresupuesto)