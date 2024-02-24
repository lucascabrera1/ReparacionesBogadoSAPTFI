import mongoose from "mongoose";
import LineaCompra from "./LineaCompra.js";

const schemaLineaRemito = new mongoose.Schema ({
    lineaCompra: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "LineaCompra"
    },
    cantidadIngresada: {
        type: Number,
        required: true
    },
    /* faltante : {
        type: Number,
        required: true
    } */
})


schemaLineaRemito.virtual("faltante")
    
    
    .get(async function (){
        const lc = await LineaCompra.findById(this.lineaCompra)
        let faltante = lc.cantidad - this.cantidadIngresada
        console.log(faltante)
        return faltante
    })
    /* .set(async function() {
        const lc = await LineaCompra.findById(this.lineaCompra)
        console.log('llega al virtual set')
        this.set(
            faltante = this.cantidadIngresada,
            faltante = faltante - this.cantidadIngresada
        )

    }) */

/* schemaLineaRemito.virtual("acum").get(function() {
    let acum = 0
    acum = acum - schemaLineaRemito.virtuals.faltante
    console.log('llega al virtual acum')
    console.log(acum)
    return acum
}) */


schemaLineaRemito.set("toJSON", {
    virtuals: true
})

export default mongoose.model('LineaRemito', schemaLineaRemito)