import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts'
import {SeleccionarTodasLasOrdenesDeCompra, RecuperarOrdenesDeCompra, EstadoOrdenesDeCompra,
    SeleccionarTodosLosProveedores, RecuperarProveedores, EstadoProveedores,
}from '../../Features/RemitoSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

function ReporteProveedores () {

    function generarNuevoColor () {
        var simbolos, color;
        simbolos = "0123456789ABCDEF";
        color = "#";
    
        for(var i = 0; i < 6; i++){
            color = color + simbolos[Math.floor(Math.random() * 16)];
        }
        return color
    }

    const estadoocs = useSelector(EstadoOrdenesDeCompra)
    const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
    const estadoproveedores = useSelector(EstadoProveedores)
    const proveedores = useSelector(SeleccionarTodosLosProveedores)
    const dispatch = useDispatch()

    useEffect(()=>{
        if (estadoocs==="idle"){
          dispatch(RecuperarOrdenesDeCompra())
        }
    },[estadoocs])

    useEffect(()=>{
        if (estadoproveedores==="idle"){
          dispatch(RecuperarProveedores())
        }
    },[estadoproveedores])

    let repetidos = [];
    let ocsxproov = [];

    ocs.forEach(function (element) {
        repetidos[element.proveedor] = (repetidos[element.proveedor] || 0) + 1
    });

    proveedores.forEach(x => {
        let informe = {
            proveedor : x.razonsocial,
            cantidadocs : repetidos[x._id]
        }
        ocsxproov.push(informe)
    })

    return (
        <div style={{width: '100%', height: 500}}>
            <h1>Mejores Proveedores</h1>
            <h2>A continuación, se enuncia un gráfico de tortas donde se indica
                un proveedor y la cantidad de ordenes de compra
            </h2>
            <ResponsiveContainer>
                <PieChart width={1200} height={1100}>
                    <Pie 
                        data={ocsxproov}
                        dataKey="cantidadocs"
                        nameKey="proveedor"
                        innerRadius={20}
                        outerRadius={85}
                        cx="50%"
                        cy="50%"
                        fill='#EBEFEA'
                    >
                        {ocsxproov.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={generarNuevoColor()}/>
                        ))} 
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ReporteProveedores