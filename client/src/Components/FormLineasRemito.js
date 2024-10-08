import React from 'react'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'
import { RecuperarRemitoDeCompra, SeleccionarTodasLasOrdenesDeCompra} from '../Features/RemitoSlice'
import {RecuperarOrdenDeCompra} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import { NavLink, useNavigate } from 'react-router-dom'

function FormLineasCompra(idRemito) {
  console.log(idRemito)
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  console.log(params)
  const [remito, setRemito] = useState({
    items: []
  })
  const [oc, setOc] = useState({
    items : []
  })

  const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
  console.log(ocs)

  useEffect(()=> {
    async function RecuperarUnRemito(){
    if (params.id){
        const remitofounded = await (dispatch(RecuperarRemitoDeCompra(params.id)).unwrap())
        console.log(remitofounded.ordenCompra)
        const ocfounded = await (dispatch(RecuperarOrdenDeCompra(remitofounded.ordenCompra)).unwrap())
        setOc(ocfounded.data)
        console.log(remitofounded.items)
        console.log(ocfounded)
        //setItems(remitofounded.items)
        setRemito(remitofounded)
      }
    }
    RecuperarUnRemito()
  }, [params])

  return (
      <div>
        <div className='row'>
          <div className='col-md-4'>
            <label for="fechaemision" className='col-form-label'>Fecha de Emisión</label>
            <input type='text' id="fechaemision" readonly defaultValue={remito.fechaemision} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-4'>
            <label className='col-form-label'>Orden de Compra</label>
            <input type='text' readonly 
              defaultValue={
                oc.codigo
              } 
              className='form-control-plaintext'
            />
          </div>
          <div className='col-md-4'>
            <label for="proveedor" className='col-form-label'>Proveedor</label>
            <input type='text' id="proveedor" readonly defaultValue={remito.proveedor} className='form-control-plaintext col-auto'/>
          </div>
        </div>
        <Table className='table table-success table-bordered border-dark'>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Esperada</th>
              <th>Cantidad Recibida</th>
              <th>Faltante</th>
            </tr>
          </thead>
          <tbody>
            {
              remito.items.length > 0 ? 
                remito.items.map(item=> {
                  console.log(item)
                  return( <tr key={item._id}>
                    <td>{item.producto}</td>
                    <td>{item.cantidadEsperada}</td>
                    <td>{item.cantidadRecibida}</td>
                    <td>{item.faltante}</td>
                  </tr>
                )})
              : "vacio"
            }
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th></th>
              <th>Remito: </th>
              <th>{remito._id}</th>
              <th></th>
            </tr>
          </tfoot>
        </Table>
        <NavLink 
          onClick={e => { e.preventDefault(); navigate('/remitos')}}>
          ...Atrás
        </NavLink>
      </div>
  )
}

export default FormLineasCompra