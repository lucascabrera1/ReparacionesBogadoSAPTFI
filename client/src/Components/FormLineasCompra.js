import React from 'react'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'
import { RecuperarOrdenDeCompra} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import { NavLink, useNavigate } from 'react-router-dom'

function FormLineasCompra() {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  console.log(params)
  const [items, setItems] = useState("")

  useEffect(()=> {
    async function RecuperarUnaOrdenDeCompra(){
    if (params.id){
      const ocfounded = await (dispatch(RecuperarOrdenDeCompra(params.id)).unwrap())
      console.log(ocfounded.items)
      setItems(ocfounded.items)
    }}
    RecuperarUnaOrdenDeCompra()
  }, [params])

  console.log(items)

  return (
      <div>
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
              items.length > 0 ? 
                items.map(item=> {
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
        </Table>
        <NavLink 
          onClick={e => { e.preventDefault(); navigate('/todaslasordenesdecompra')}}>
          ...Atrás
        </NavLink>
      </div>
  )
}

export default FormLineasCompra