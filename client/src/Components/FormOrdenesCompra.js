import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodasLasOrdenesDeCompra,
  RecuperarOrdenesDeCompra,
  EstadoOrdenesDeCompra,
} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import FormLineasCompra from './FormLineasCompra.js'
import { formatHumanDateTime, formatHumanDate } from '../Util/DateFormat.js'

function FormOrdenesCompra() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
  const estadoocs = useSelector(EstadoOrdenesDeCompra)
  const [oc, setoc] = useState({})

  console.log(ocs)

  useEffect(()=>{
    if (estadoocs==="idle"){
      dispatch(RecuperarOrdenesDeCompra())
    }
  },[estadoocs])

  return (
    <div>aca devolvemos todas las ordenes de compra
      <ul><li><NavLink to={'/nuevaordendecompra'}>Generar una nueva orden de compra</NavLink></li></ul>
      <Table className= 'table table-success table-bordered border-dark'>
        <thead>
          <tr>
            <th>Fecha de emisión</th>
            <th>Fecha de Entrega</th>
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
                <td>{oc.fechaemision ? formatHumanDateTime(oc.fechaemision) : "vacia"}</td>
                <td>{oc.fechaentrega ?  formatHumanDate(oc.fechaentrega) : "vacia"}</td>
                <td>{oc.proveedor}</td>
                <td>{oc.formapago}</td>
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
      variant='secondary' 
      onClick={e => {
        e.preventDefault() 
        navigate('/ordenesdecompra')
      }}>...Atrás</Button>
    </div>
  )
}

export default FormOrdenesCompra