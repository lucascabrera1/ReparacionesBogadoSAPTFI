import React from 'react'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'
import { RecuperarOrdenDeCompra, CambiarEstadoOC} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'


function FormLineasCompra(idOc) {
  const {register, handleSubmit, formState : {errors}} = useForm()
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
      console.log(ocfounded)
      setOc(ocfounded.data)
    }
  }
    RecuperarUnaOrdenDeCompra()
  }, [params])

  async function CambiarEstado(estado) {
    try {
      console.log(estado)
      console.log(params.id)
      const result = await dispatch(CambiarEstadoOC({estado, id: params.id})).unwrap()
      console.log(result)
      alert(`Orden de Compra ${estado} correctamente`)
      navigate('/todaslasordenesdecompra')
    } catch (error) {
      console.error(error)
    }
  }

  console.log(oc.items)

  return oc === undefined ? <div>no hay oc</div> : (
      <div>
        <div className='row'>
          <div className='col-md-2'>
            <label for="fechaemision" className='col-form-label'>Fecha de Emisión</label>
            <input type='text' id="fechaemision" readonly defaultValue={oc.fechaemision} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-2'>
            <label className='col-form-label'>Fecha de entrega</label>
            <input type='text' readonly defaultValue={oc.fechaentrega} className='form-control-plaintext'/>
          </div>
          <div className='col-md-2'>
            <label for="proveedor" className='col-form-label'>Proveedor</label>
            <input type='text' id="proveedor" readonly defaultValue={oc.proveedor} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-2'>
            <label className='col-form-label'>Forma de Pago</label>
            <input type='text' readonly defaultValue={oc.formapago} className='form-control-plaintext'/>
          </div>
          <div className='col-md-2'>
            <label for="proveedor" className='col-form-label'>Código</label>
            <input type='text' id="proveedor" readonly defaultValue={oc.codigo} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-2'>
            <label className='col-form-label'>Estado</label>
            <input type='text' readonly defaultValue={oc.estado} className='form-control-plaintext'/>
          </div>
        </div>
        <Table className='table table-success table-bordered border-dark'>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
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
        {
          oc.estado === "Pendiente" ? 
          <div>
            <Button 
              variant="success" 
              size="lg"
              onClick={()=>CambiarEstado("Confirmada")}
            >
              Confirmar Orden de Compra
            </Button>
            <Button 
              variant="danger" 
              size="lg"
              onClick={()=>CambiarEstado("Rechazada")}
            >
              Rechazar Orden de Compra
            </Button>
          </div>: <div>
            La orden de compra ya está {oc.estado}, no se pueden realizar modificaciones
          </div>
        }
        
        <NavLink
          onClick={e => { e.preventDefault(); navigate('/todaslasordenesdecompra')}}>
          ...Atrás
        </NavLink>
      </div>
  )
}

export default FormLineasCompra