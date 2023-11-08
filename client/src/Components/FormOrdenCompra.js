import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, NavLink, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import Form from 'react-bootstrap/Form'
import {RecuperarProveedores, RecuperarProductosPorProveedor, AgregarOrdenDeCompra,
  SeleccionarTodosLosProductos, SeleccionarTodosLosProveedores,
  EstadoProveedores, EstadoProductos} from '../Features/OrdenCompraSlice.js'
import Table from 'react-bootstrap/esm/Table.js'

function FormOrdenCompra() {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const productos = useSelector(SeleccionarTodosLosProductos)
  const estadoproveedores = useSelector(EstadoProveedores)
  /* const estadoproductos = useSelector(EstadoProductos)
  const [idProveedor, setIdProveedor] = useState("") */
  const {register, handleSubmit, formState : {errors}} = useForm()

  useEffect(()=>{
    if (estadoproveedores==="idle"){
      dispatch(RecuperarProveedores())
    }
  },[estadoproveedores])
 
  const optionProveedores = proveedores.map(p => (<option
    value={p._id} 
    key={p._id}
    >{p.razonsocial}
  </option>))

  return (
    <div>
      Acá voy a generar UNA orden de compra
      <Form style={{width: '450px', border: '2px solid black'}}>
        <label>Proveedor</label>
        <Form.Select
          aria-label='Proveedor'
          className='col-md-2'
          size='sm'
          name='proveedor'
          {...register('proveedor')}
          onChange={(e) => {
            e.preventDefault()
            console.log(e.target.value)
            dispatch(RecuperarProductosPorProveedor(e.target.value))
          }}
        >
          {optionProveedores}
        </Form.Select>
      </Form>
      <Table className= 'table table-success table-bordered border-dark'>
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Marca</th>
                <th>Código</th>
                <th>Precio de Compra</th>
                <th>Precio de Venta</th>
                <th>Punto de Pedido</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            {
              productos.map( producto => { 
                  return <tr key={producto._id}>
                    <td>{producto.descripcion}</td>
                    <td>{producto.categoria}</td>
                    <td>{producto.proveedor}</td>
                    <td>{producto.marca}</td>
                    <td>{producto.codigo}</td>
                    <td>{producto.preciocompra}</td>
                    <td>{producto.precioventa}</td>
                    <td>{producto.puntopedido}</td>
                    <td>{producto.stock}</td>
                  </tr>
                }
              )
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

export default FormOrdenCompra