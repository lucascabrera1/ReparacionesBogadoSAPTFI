import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import {SeleccionarTodosLosRemitos, EstadoRemitos, RecuperarRemitos, ErroresRemitos}from '../../Features/RemitoSlice'
import {SeleccionarTodosLosProductos, EstadoProductos, RecuperarProductos}from '../../Features/OrdenCompraSlice'
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

function FormReporteRemitos() {

  const dispatch = useDispatch()
  const estadoremitos = useSelector(EstadoRemitos)
  const remitos = useSelector(SeleccionarTodosLosRemitos)
  const estadoproductos = useSelector(EstadoProductos)
  const productos = useSelector(SeleccionarTodosLosProductos)
  const erroresremito = useSelector(ErroresRemitos)

  let lineas = []
  let faltantes = []
  let fxp = []
  let informefxp = []

  for (let i = 0; i< remitos.length; i++) {
    if (remitos[i].items) {
      for (let j = 0; j < remitos[i].items.length; j++) {
        lineas.push(remitos[i].items[j])
      }
    } else if (remitos[i].detalles) {
      for (let j = 0; j < remitos[i].detalles.length; j++) {
        lineas.push(remitos[i].detalles[j])
      }
    }
  }

  lineas.forEach(function (element) {
    faltantes[element.producto] = (faltantes[element.producto] || 0) + element.faltante
  });

  productos.forEach(x => {
    let informe = {
      producto : x.descripcion,
      faltante : faltantes[x.descripcion] ? faltantes[x.descripcion] : 0
    }
    fxp.push(informe)
  })

  fxp.forEach( x => {
    if (x.faltante !== 0) {
      informefxp.push(x)
    }
  })

  useEffect(()=>{
    if (estadoremitos==="idle"){
      dispatch(RecuperarRemitos())
    }
  },[estadoremitos])

  useEffect(()=>{
    if (estadoproductos==="idle"){
      dispatch(RecuperarProductos())
    }
  },[estadoproductos])

  console.log(informefxp)

  return ( erroresremito ? (<div className='alert alert-danger'>{erroresremito}</div>) :
    <div>
      <h3>Cantidad de unidades faltante por cada producto</h3>
      <ResponsiveContainer width={600} height={300}>
        <BarChart
          width={500}
          height={300}
          data={informefxp}
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

//<Bar dataKey="producto" fill="#8884d8" />

export default FormReporteRemitos

{/* <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>faltante</th>
          </tr>
        </thead>
        <tbody>
          {informefxp.map(x => {
            return <tr key={x.producto}>
              <td>{x.producto}</td>
              <td>{x.faltante}</td>
            </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>fin</td>
          </tr>
        </tfoot>
      </table> */}