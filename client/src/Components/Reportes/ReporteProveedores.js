import React, { useState } from 'react'
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts'
import {SeleccionarTodasLasOrdenesDeCompra, RecuperarOrdenesDeCompra, EstadoOrdenesDeCompra,
    SeleccionarTodosLosProveedores, RecuperarProveedores, EstadoProveedores,
}from '../../Features/RemitoSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
    

const datad = [
    {name: "Julia", value: 500}, 
    {name: "Maria", value: 600}, 
    {name: "Teresa", value: 700}
]
const colores = ['blueviolet', 'blue', '#000975']

function ReporteProveedores  ()  {
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

    ocs.forEach(function (element) {
        repetidos[element.proveedor] = (repetidos[element.proveedor] || 0) + 1
        let proveedorseleccionado = proveedores.find(x => x._id === element.proveedor)
        let informe = {
            proveedor : proveedorseleccionado.razonsocial,
            cantidadocs: repetidos[element.proveedor]
        }
        let proveedorencontrado = repetidos.find(x => x.proveedor === informe.proveedor)
        if (proveedorencontrado === undefined) {
            repetidos.push(informe)
        } else {
            repetidos.pop()
            repetidos.push(informe)
        }
        
    });

    return (
        <div style={{width: '100%', height: 500}}> reporte proveedores
            <ResponsiveContainer>
                <PieChart width={1200} height={1100}>
                    <Pie 
                        data={repetidos}
                        dataKey="cantidadocs"
                        nameKey="proveedor"
                        innerRadius={20}
                        outerRadius={85}
                        cx="50%"
                        cy="50%"
                        fill='#EBEFEA'
                    >
                        {repetidos.map((entry, index) => (
                            <Cell key={index} fill={colores[index%colores.length]}/>
                        ))} 
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ReporteProveedores