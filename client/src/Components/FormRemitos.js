import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {RecuperarRemitos, EstadoRemitos, RecuperarOrdenesDeCompra, SeleccionarTodosLosRemitos, 
  EstadoOrdenesDeCompra,  ErroresRemitos, ErroresOrdenesDeCompra} from '../Features/RemitoSlice.js'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import { formatHumanDateTime, formatHumanDate } from '../Util/DateFormat.js'

function FormRemitos() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const remitos = useSelector(SeleccionarTodosLosRemitos)
  const estadoremitos = useSelector(EstadoRemitos)
  //const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
  const estadoocs = useSelector(EstadoOrdenesDeCompra)
  const erroresremito = useSelector(ErroresRemitos)
  console.log(erroresremito)
  
  useEffect(()=>{
    if (estadoremitos==="idle"){
      dispatch(RecuperarRemitos())
    }
  },[estadoremitos])

  useEffect(()=>{
    if (estadoremitos==="idle"){
      dispatch(RecuperarOrdenesDeCompra())
    }
  },[estadoocs])

  return erroresremito ? (<div className='alert alert-danger'>{erroresremito}</div>) :  (
    <div>
      <h2 style={{backgroundColor: 'yellowgreen'}}>Remitos de Compra ingresados hasta el momento</h2>
      <Table className= 'table table-success table-bordered border-dark'>
        <thead>
          <tr>
            <th>Fecha de emisión</th>
            <th>Proveedor</th>
            <th>Orden de Compra</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {
            remitos.map( remito => {
              return <tr key={remito._id}>
                <td>{remito.fechaemision ? formatHumanDateTime(remito.fechaemision) : "vacia"}</td>
                <td>{remito.proveedor}</td>
                <td>{remito.ordenCompra}</td>
                <td><NavLink to={`/remitos/${remito._id}`}> Ver Detalles...</NavLink></td>
              </tr>
              }
            )
          }
        </tbody>
      </Table>
      <Button 
        variant='primary' 
        style={{backgroundColor: 'green', color: 'black'}}
        onClick={e => {
          e.preventDefault()
          navigate('/nuevoremito')
        }}
      >
        Agregar Nuevo Remito
      </Button>
      <Button 
        variant='secondary' 
        onClick={e => {
            e.preventDefault() 
            navigate('/')
        }}>...Atrás
      </Button>
    </div>
  )
}

export default FormRemitos