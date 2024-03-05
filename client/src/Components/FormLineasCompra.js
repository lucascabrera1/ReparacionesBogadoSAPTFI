import React from 'react'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'
import { RecuperarOrdenDeCompra} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import { NavLink, useNavigate } from 'react-router-dom'

function FormLineasCompra(idOc) {
  console.log(idOc)
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  console.log(params)
  const [oc, setOc] = useState({
    items: []
  })

  useEffect(()=> {
  async function RecuperarUnaOrdenDeCompra(){
   if (params.id){
      const ocfounded = await (dispatch(RecuperarOrdenDeCompra(params.id)).unwrap())
      console.log(ocfounded.items)
      //setItems(ocfounded.items)
      setOc(ocfounded)
    }
  }
    RecuperarUnaOrdenDeCompra()
  }, [params])

  console.log(oc.items)

  return (
      <div>
        <div className='row'>
          <div className='col-md-3'>
            <label for="fechaemision" className='col-form-label'>Fecha de Emisión</label>
            <input type='text' id="fechaemision" readonly defaultValue={oc.fechaemision} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-3'>
            <label className='col-form-label'>Fecha de entrega</label>
            <input type='text' readonly defaultValue={oc.fechaentrega} className='form-control-plaintext'/>
          </div>
          <div className='col-md-3'>
            <label for="proveedor" className='col-form-label'>Proveedor</label>
            <input type='text' id="proveedor" readonly defaultValue={oc.proveedor} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-3'>
            <label className='col-form-label'>Forma de Pago</label>
            <input type='text' readonly defaultValue={oc.formapago} className='form-control-plaintext'/>
          </div>
        </div>
        <Table className='table table-success table-bordered border-dark'>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Faltante</th>
            </tr>
          </thead>
          <tbody>
            {
              oc.items.length > 0 ? 
                oc.items.map(item=> {
                  return( <tr key={item._id}>
                    <td>{item.producto}</td>
                    <td>{item.preciocompra}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.subtotal}</td>
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
              <th>Total: </th>
              <th>{oc.total}</th>
              <th></th>
            </tr>
          </tfoot>
        </Table>
        <NavLink 
          onClick={e => { e.preventDefault(); navigate('/todaslasordenesdecompra')}}>
          ...Atrás
        </NavLink>
      </div>
  )
}

export default FormLineasCompra