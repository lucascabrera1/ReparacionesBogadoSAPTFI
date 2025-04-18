//reporte de los celulares mas reparados con su respectiva cantidad de reparaciones

import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import {ArmarReporteReparaciones, EstadoReparaciones, SeleccionarTodasLasReparaciones,
  SeleccionarTodasLasMarcas, EstadoMarcas, RecuperarMarcas
}from '../../Features/ReparacionesSlice'

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
  const marcas = useSelector(SeleccionarTodasLasMarcas)
  const estadomarcas = useSelector(EstadoMarcas)

  useEffect(()=>{
    if (estadoreparaciones === "idle"){
      dispatch(ArmarReporteReparaciones())
    }
  },[estadoreparaciones])


  useEffect(() => {
    if (estadomarcas === "idle") {
      dispatch(RecuperarMarcas())
    }
  }, [estadomarcas])

  console.log(estadoreparaciones)
  console.log(reparaciones)
  console.log(marcas)

  let marcaymodelos = []
  let cantReparaciones = []

  if (reparaciones.length > 0){
    reparaciones.forEach(element => {
      const marcaymodelo = element.marca + " " + element.modelo
      console.log(marcaymodelo)
      marcaymodelos[marcaymodelo] = (marcaymodelos[marcaymodelo] || 0) + 1
    });
  }
  

  marcas.forEach(marca => {
    marca.modelos.forEach (modelo => {
      let newInforme = {
        marcaymodelo : marca.nombre + " " + modelo.nombre,
        cantRep : marcaymodelos[marca.nombre + " " + modelo.nombre]
      }
      if (newInforme.cantRep > 0) cantReparaciones.push(newInforme)
    })
  })

  console.log(marcaymodelos)
  console.log(cantReparaciones)

  return (
    <div>
      <h3>Cantidad de reparaciones por cada equipo por marca y modelo</h3>
      <ResponsiveContainer width={1354} height={357}>
        <BarChart
          width={730}
          height={250}
          data={cantReparaciones}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke='#ccc'/>
          <XAxis dataKey= "marcaymodelo" />
          <YAxis dataKey="cantRep"/>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="cantRep" fill="#0884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
  )
}

export default FormReporteReparaciones