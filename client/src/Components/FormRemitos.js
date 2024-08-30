import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {RecuperarRemitos, EstadoRemitos, SeleccionarTodosLosRemitos, 
  EstadoOrdenesDeCompra,  ErroresRemitos, SeleccionarTodasLasOrdenesDeCompra,
  SeleccionarTodosLosProveedores,
  RecuperarOrdenesDeCompra} from '../Features/RemitoSlice.js'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import { formatHumanDateTime} from '../Util/DateFormat.js'

function FormRemitos() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const remitos = useSelector(SeleccionarTodosLosRemitos)
  const estadoremitos = useSelector(EstadoRemitos)
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
  const estadoocs = useSelector(EstadoOrdenesDeCompra)
  const erroresremito = useSelector(ErroresRemitos)
  //const estadoproveedores = useSelector(EstadoProveedores)
  console.log(erroresremito)
  console.log(remitos)
  console.log(proveedores)
  console.log(estadoocs)

  
  useEffect(()=>{
    if (estadoremitos==="idle"){
      dispatch(RecuperarRemitos())
    }
  },[estadoremitos])

  useEffect(() => {
    if (estadoocs === "idle") dispatch(RecuperarOrdenesDeCompra())
  }, [estadoocs])


  console.log(ocs)

  return erroresremito ? (<div className='alert alert-danger'>{erroresremito}</div>) :  (
    <div>
      <h2 style={{backgroundColor: 'yellowgreen'}}>Remitos de Compra ingresados hasta el momento</h2>
      <Table className= 'table table-success table-bordered border-dark'>
        <thead>
          <tr key="null">
            <th>Fecha de emisión</th>
            <th>Proveedor</th>
            <th>Orden de Compra</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {
            remitos.map( remito => {
              return <tr key={remito._id ? remito._id : remito.data._id}>
                <td>{
                  //remito.fechaemision ? 
                  formatHumanDateTime(remito.fechaemision) 
                  //:formatHumanDateTime(remito.data.fechaEmision)
                }</td>
                <td>{
                  remito.proveedor 
                  //? remito.proveedor : proveedores.find(x => x._id === remito.data.proveedor).razonsocial
                }</td>
                <td>{
                  
                  ocs.find(oc => oc._id === remito.ordenCompra)?.codigo
                  /*remito.ordenCompra ? ocs.find(oc => oc._id === remito.ordenCompra).codigo : 
                  remito.ordenCompra.codigo
                  ocs.find(oc => oc._id === remito.data.ordenCompra).codigo
                  ocs.find(oc => oc._id === remito.ordenCompra).codigo ?
                  ocs.find(oc => oc._id === remito.ordenCompra).codigo :
                  ocs.find(oc => oc._id === remito.data.ordenCompra).codigo ?
                  ocs.find(oc => oc._id === remito.data.ordenCompra).codigo : "" */
                  
                }</td>
                <td><NavLink to={`/remitos/${remito._id ? remito._id : remito.data._id}`}> Ver Detalles...</NavLink></td>
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