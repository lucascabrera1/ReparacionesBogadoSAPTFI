import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts'
import {SeleccionarTodasLasOrdenesDeCompra, RecuperarOrdenesDeCompra, EstadoOrdenesDeCompra
}from '../../Features/RemitoSlice'
import {SeleccionarTodosLosProveedores, RecuperarProveedores, EstadoProveedores, ErroresOrdenesDeCompra,
ErroresProveedores } from '../../Features/OrdenCompraSlice'
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
    const estadoproveedores = useSelector(EstadoProveedores)
    const dispatch = useDispatch()
    const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
    const erroresocs = useSelector(ErroresOrdenesDeCompra)
    const erroresproveedores = useSelector(ErroresProveedores)
    console.log(ocs)
    
    const proveedores = useSelector(SeleccionarTodosLosProveedores)
    console.log(proveedores)

    useEffect(()=>{
        if (estadoocs==="idle"){
          dispatch(RecuperarOrdenesDeCompra())
        }
    },[estadoocs])

    useEffect(()=>{
        console.log(estadoproveedores)
        if (estadoproveedores==="idle"){
            console.log('se hace dispatch de recuperar proveedores')
          dispatch(RecuperarProveedores())
        }
    },[estadoproveedores])

    let repetidos = [];
    let ocsxproov = [];

    ocs.forEach(function (element) {
        console.log(element)
        repetidos[element.proveedor._id] = (repetidos[element.proveedor._id] || 0) + 1
    });

    console.log(repetidos)

    proveedores.forEach(x => {
        let informe = {
            proveedor : x.razonsocial,
            cantidadocs : repetidos[x._id]
        }
        console.log(informe)
        ocsxproov.push(informe)
    })

    console.log(repetidos)
    console.log(ocsxproov)

    return erroresocs ? <div className='alert alert-danger'>{erroresocs}</div> :
    erroresproveedores ? <div className='alert alert-danger'>{erroresproveedores}</div> :
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
}

export default ReporteProveedores