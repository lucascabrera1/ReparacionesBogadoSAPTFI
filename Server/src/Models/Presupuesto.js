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

export default model('Presupuesto', schemaPresupuesto)