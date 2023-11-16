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
  const {register, handleSubmit, formState : {errors}} = useForm()
  const [descripcion, setDescripcion] = useState("")
  const [preciocompra, setPreciocompra] = useState()
  const [total, setTotal] = useState(0)
  const [cantidad, setCantidad] = useState()
  const [oc,setOC] = useState({
    lineasCompra: [{
      descripcion, preciocompra, cantidad
    }]
  })

  /* useEffect((producto)=> {
    setProducto(producto)
    console.log('producto seteado despues de pasar por el use effect')
    console.log(productoSeleccionado)
  }, [productoSeleccionado])
 */
  useEffect(()=>{
    if (estadoproveedores==="idle"){
      dispatch(RecuperarProveedores())
    }
  },[estadoproveedores])

   /* useEffect(()=> {
    console.log(idProducto)
    console.log(productos)
    setProductoSeleccionado(productos.filter(p => p._id === idProducto))
    console.log(productoSeleccionado)
  }, [idProducto]) */  
 
  const optionProveedores = proveedores.map(p => (<option
    value={p._id} 
    key={p._id}
    >{p.razonsocial}
  </option>))

  const AgregarLineaCompra = (descripcion, preciocompra, cantidad) => {
    console.log(cantidad)
    console.log(descripcion)
    console.log(preciocompra)
    const lineaCompra = {
      descripcion: descripcion,
      cantidad: parseInt(cantidad),
      subtotal : parseFloat(preciocompra * cantidad)
    }
    console.log(lineaCompra)
    //console.log(total)
    
    oc.lineasCompra.push(lineaCompra)

    
    
    console.log(lineaCompra.subtotal)
    console.log(oc)
    /* oc.lineasCompra.forEach(lc => {
      console.log(lc)
      let subtotal = parseInt(lc.cantidad * lc.preciocompra)
      console.log(subtotal)
      setTotal(total + subtotal)
    }) */
    setTotal(total + lineaCompra.subtotal)
    console.log(total)
    console.log(oc)
  }

  const handleSubmitLC = (data) => {
    console.log(data)
    console.log('handle submit linea compra')
    setCantidad(parseInt(data.cantidad))
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
            return <tr 
              key={producto._id} 
              onClick={e=> {
                console.log('se ejecuta el onclick del tr')
                console.log(producto)
                e.preventDefault()
                console.log('ejectuta algo despues del set producto')
                setDescripcion(producto.descripcion)
                setPreciocompra(producto.preciocompra)
                //AgregarLineaCompra(producto, cantidad)
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
      
      <p>Producto seleccionado: {descripcion}</p>
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

          /* console.log('producto antes del setProducto')
          console.log(productoSeleccionado)
          console.log('fin producto antes del set producto')
          
          setProductoSeleccionado(productoSeleccionado)
          console.log('producto seteado')
          console.log(productoSeleccionado)
          console.log('fin producto') */
          setCantidad(cantidad)
          console.log(descripcion, preciocompra, cantidad)
          AgregarLineaCompra(descripcion, preciocompra, cantidad);
          console.log(descripcion)
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