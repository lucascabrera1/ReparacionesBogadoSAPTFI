import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, NavLink, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import Form from 'react-bootstrap/Form'
import {RecuperarProveedores, RecuperarProductosPorProveedor, AgregarOrdenDeCompra,
  SeleccionarTodosLosProductos, SeleccionarTodosLosProveedores,
  EstadoProveedores} from '../Features/OrdenCompraSlice.js'
import Table from 'react-bootstrap/esm/Table.js'

function FormOrdenCompra() {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const estadoproveedores = useSelector(EstadoProveedores)
  const productos = useSelector(SeleccionarTodosLosProductos)
  const [idProveedor, setIdProveedor] = useState("")
  const {register, handleSubmit, formState : {errors}} = useForm()
  const [producto, setProducto] = useState()
  const [total, setTotal] = useState()
  const [cantidad, setCantidad] = useState()

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

  const AgregarLineaCompra = (producto, cantidad) => {
    console.log(cantidad)
    console.log(producto)
    let lineaCompra = {
      producto: producto,
      cantidad: cantidad,
      subtotal : producto.preciocompra * cantidad
    }
    setTotal(total + lineaCompra.subtotal)
    console.log(lineaCompra)
    console.log(total)
  }

  const handleSubmitLC = (data) => {
    console.log(data)
    console.log('handle submit linea compra')
    setCantidad(data.cantidad)
    console.log(cantidad)
  }

  const handleSubmitOC = (data) => {
    console.log(data)
    console.log('handle submit orden compra')
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(handleSubmitLC)}>
        <div>
          formulario dentro de otro formulario
          <Button type='submit'> Enviar linea compra</Button>
        </div>
      </Form>
      <br/>
      Acá voy a generar UNA orden de compra
      <Form onSubmit={handleSubmit(handleSubmitLC)} style={{border: '2px solid black'}}>
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
      
      <Table
        className= 'table table-success table-bordered border-dark'
        /* onClick={(e)=> {
          console.log(e)
          setProducto(e.target)
          console.log(producto)
        }} */
      >
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
          {productos.map( producto => { 
            return <tr key={producto._id} onClick={e=> {
              e.preventDefault()
              console.log(producto)
              setProducto(producto)
            }}>
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
          })}
        </tbody>
      </Table>
      
      <p>Producto seleccionado: {producto._id}</p>
      <Input
        type="number"
        name="cantidad"
        placeholder="ingrese la cantidad"
        register = {register}
        registerOptions={{required: true, min: 1}}
        optionMsgErrors={{
          required: "La cantidad es requerida",
          min: "minimo 1 producto"
        }}
        errors={errors}
      />
      <Button
        onClick={(e)=>{
          e.preventDefault()
          AgregarLineaCompra(producto, cantidad);
          console.log(producto)
      }}
        >Agregar línea de compra
      </Button>

      <p>Descripción de la orden de compra al momento</p>
      { <Table className= 'table table-success table-bordered border-dark'>
        <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            {
              productos.map( producto => { 
                  return <tr key={producto._id}>
                    <td>Producto</td>
                    <td>Precio de Compra</td>
                    <td>precio Unitario</td>
                    <td>Subtotal</td>
                  </tr>
                }
              )
            }
        </tbody>
      </Table>}
      <NavLink 
        onClick={e => { e.preventDefault(); navigate('/todaslasordenesdecompra')}}>
        ...Atrás
      </NavLink>
      <Button type='submit'>Generar nueva orden de compra</Button>
      </Form>
    </div>
  )
}

export default FormOrdenCompra