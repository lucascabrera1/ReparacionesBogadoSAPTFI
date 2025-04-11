//reporte de ventas con la cantidad por equipo que se vendieron

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts'
import {SeleccionarTodasLasVentas, RecuperarVentas, EstadoVentas }from '../../Features/VentaSlice'
import {SeleccionarTodosLosProductos, RecuperarProductos, EstadoProductos} from '../../Features/OrdenCompraSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

function FormReporteVentas () {

    function generarNuevoColor () {
        var simbolos, color;
        simbolos = "0123456789ABCDEF";
        color = "#";
        for(var i = 0; i < 6; i++){
            color = color + simbolos[Math.floor(Math.random() * 16)];
        }
        return color
    }

    const dispatch = useDispatch()
    const estadoventas = useSelector(EstadoVentas)
    const ventas = useSelector(SeleccionarTodasLasVentas)
    const estadoproductos = useSelector(EstadoProductos)
    const productos = useSelector(SeleccionarTodosLosProductos)
    console.log(ventas)

    useEffect(()=>{
        if (estadoventas==="idle"){
          dispatch(RecuperarVentas())
        }
    },[estadoventas])

    useEffect(()=>{
        if (estadoproductos==="idle"){
          dispatch(RecuperarProductos())
        }
    },[estadoproductos])

    let repetidos = [];

    ventas.forEach(function (element) {
        for (let i = 0; i<element.detalles.length; i++) {
            console.log(element.detalles[i].producto)
            repetidos[element.detalles[i].producto] = (repetidos[element.detalles[i].producto] || 0) + element.detalles[i].cantidad
        }
    });

    console.log(repetidos)
    let informe = []

    productos.forEach(p => {
        console.log(repetidos[p.descripcion])
        let ventasporproducto = {
            producto : p.descripcion,
            cantVentas : repetidos[p.descripcion] || 0
        }
        informe.push(ventasporproducto)
    })

    console.log(informe)


    return (
        <div style={{width: '100%', height: 500}}>
            <h1>Mejores Proveedores</h1>
            <h2>A continuación, se enuncia un gráfico de tortas donde se indica
                por cada producto la cantidad de ventas
            </h2>
            <ResponsiveContainer>
                <PieChart width={1200} height={1100}>
                    <Pie 
                        data={informe}
                        dataKey="cantVentas"
                        nameKey="producto"
                        innerRadius={20}
                        outerRadius={85}
                        cx="50%"
                        cy="50%"
                        fill='#EBEFEA'
                    >
                        {informe.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={generarNuevoColor()}/>
                        ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FormReporteVentas