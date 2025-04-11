//reporte de los celulares mas reparados con su respectiva cantidad de reparaciones

import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import {SeleccionarTodasLasReparaciones, EstadoReparaciones, RecuperarReparaciones}from '../../Features/ReparacionesSlice'
import {SeleccionarTodasLasMarcas}from '../../Features/OrdenCompraSlice'
import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

function FormReporteReparaciones() {

  const dispatch = useDispatch()
  const estadoreparaciones = useSelector(EstadoReparaciones)
  const reparaciones = useSelector(SeleccionarTodasLasReparaciones)

  useEffect(()=>{
    if (estadoreparaciones==="idle"){
      dispatch(RecuperarReparaciones())
    }
  },[estadoreparaciones])

  console.log(reparaciones)
  console.log(estadoreparaciones)

  return (
    <div>
      <h3>Cantidad de unidades faltante por cada producto</h3>
      <ResponsiveContainer width={600} height={300}>
        <BarChart
          width={500}
          height={300}
          //data={informefxp}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke='#ccc'/>
          <XAxis dataKey="producto" />
          <YAxis dataKey="faltante"/>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="faltante" fill="#0884d8" />
        </BarChart>
      </ResponsiveContainer>
      <h5>Aclaración importante: un valor negativo indica que sobran productos, 
      un valor positivo indica que faltan productos</h5>
    </div>
    
  )
}

export default FormReporteReparaciones