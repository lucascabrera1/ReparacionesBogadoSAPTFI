import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodasLasOrdenesDeCompra,
  RecuperarOrdenesDeCompra,
  EstadoOrdenesDeCompra,
  ErroresOrdenesDeCompra,
  SeleccionarTodosLosProveedores,
  EstadoProveedores,
  SeleccionarTodasLasFormasDePago,
  EstadoFormasDePago,
  RecuperarProveedores,
  RecuperarFormasDePago
} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import { formatHumanDateTime, formatHumanDate } from '../Util/DateFormat.js'

function FormOrdenesCompra() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const erroresocs = useSelector(ErroresOrdenesDeCompra)

  const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const formasdepago = useSelector(SeleccionarTodasLasFormasDePago)
  
  const estadofp = useSelector(EstadoFormasDePago)
  const estadoproveedores = useSelector(EstadoProveedores)
  const estadoocs = useSelector(EstadoOrdenesDeCompra)
  //const [oc, setoc] = useState({})

  console.log(proveedores)

  console.log(ocs)

  useEffect( ()=>{
      dispatch(RecuperarOrdenesDeCompra())
  },[])

  useEffect( ()=>{
    if (estadoocs==="idle"){
      dispatch(RecuperarOrdenesDeCompra())
    }
  },[estadoocs])

  useEffect( ()=>{
    if (estadoproveedores==="idle"){
      dispatch(RecuperarProveedores())
    }
  },[estadoproveedores, estadoocs])

  useEffect( ()=>{
    if (estadofp==="idle"){
      dispatch(RecuperarFormasDePago())
    }
  },[estadofp])

  return erroresocs ? (<div className='alert alert-danger'>{erroresocs}</div>) :  (
    <div>
      <h1>Todas las Órdenes de Compra generadas hasta el momento</h1>
      <Table className= 'table table-success table-bordered border-dark'>
        <thead>
          <tr>
            <th>Fecha de emisión</th>
            <th>Fecha de Entrega</th>
            <th>Código</th>
            <th>Proveedor</th>
            <th>Forma de Pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {
            ocs.map( oc => {
              return <tr key={oc._id}>
                <td>{
                  oc.fechaemision ? formatHumanDateTime(oc.fechaemision) : ""
                  //oc.fechaEmision ? formatHumanDateTime(oc.fechaEmision)  : ""
                }</td>
                <td>{
                  oc.fechaentrega ?  formatHumanDate(oc.fechaentrega) : ""
                  //oc.fechaEntrega ? formatHumanDate(oc.fechaEntrega)  : ""
                }</td>
                <td>{oc.codigo}</td>
                <td>{
                  oc.proveedor.razonsocial 
                  /* ? oc.proveedor.razonsocial :
                  proveedores.find(x => x._id === oc.proveedor).razonsocial */
                }</td>
                <td>{
                  oc.formapago 
                  /* ? oc.formapago :
                  formasdepago.find(x=> x._id === oc.formaDePago).descripcion */
                }</td>
                <td>{oc.total}</td>
                <td>{oc.estado}</td>
                <td><NavLink to={`/ordenesdecompra/${oc._id}`}> Ver Detalles...</NavLink></td>
              </tr>
              }
            )
          }
        </tbody>
      </Table>
      <Button
        variant='primary'
        size='lg'
        onClick={e => {
          e.preventDefault()
          navigate('/nuevaordendecompra')
        }}
      >
        Nueva Orden de Compra
      </Button>
      <Button
        size='lg'
        variant='secondary' 
        onClick={e => {
          e.preventDefault() 
          navigate('/')
        }}>
        ...Atrás
      </Button>
    </div>
  )
}

export default FormOrdenesCompra