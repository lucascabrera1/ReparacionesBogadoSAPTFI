import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'
import {RecuperarVenta} from '../Features/VentaSlice'
import Table from 'react-bootstrap/Table'
import { NavLink, useNavigate } from 'react-router-dom'

function FormLineasVenta(idVenta) {
  console.log(idVenta)
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  console.log(params)
  const [venta, setVenta] = useState({
    detalles: []
  })

  

  useEffect(()=> {
    async function RecuperarUnaventa(){
    if (params.id){
        const ventaencontrada = await (dispatch(RecuperarVenta(params.id)).unwrap())
        console.log(ventaencontrada)
        setVenta(ventaencontrada.data)
      }
    }
    RecuperarUnaventa()
  }, [params])

  return (
      <div>
        <div className='row'>
          <div className='col-md-3'>
            <label className='col-form-label'>Codigo de Venta</label>
            <input type='text' readonly 
              defaultValue={venta.codigo} 
              className='form-control-plaintext'
            />
          </div>
          <div className='col-md-3'>
            <label for="fechaemision" className='col-form-label'>Fecha de Emisión</label>
            <input type='text' id="fechaemision" readonly defaultValue={venta.fechaEmision} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-3'>
            <label for="proveedor" className='col-form-label'>Cliente</label>
            <input type='text' id="proveedor" readonly defaultValue={venta.cliente} className='form-control-plaintext col-auto'/>
          </div>
          <div className='col-md-3'>
            <label for="formadepago" className='col-form-label'>Forma de Pago</label>
            <input type='text' id="formadepago" readonly defaultValue={venta.formaDePago} className='form-control-plaintext col-auto'/>
          </div>
        </div>
        <Table className='table table-success table-bordered border-dark'>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio de Venta</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {
             venta.detalles.length > 0 ? 
                venta.detalles.map(item=> {
                  console.log(item)
                  return( <tr key={item._id}>
                    <td>{item.producto}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.precioventa}</td>
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
              <th>{venta.total}</th>
              <th></th>
            </tr>
          </tfoot>
        </Table>
        <NavLink 
          onClick={e => { e.preventDefault(); navigate('/ventas')}}>
          ...Atrás
        </NavLink>
      </div>
  )
}

export default FormLineasVenta