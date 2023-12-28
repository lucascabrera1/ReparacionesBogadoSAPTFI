import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, NavLink, useParams} from 'react-router-dom'
import {useForm, useFieldArray} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import Form from 'react-bootstrap/Form'
import {RecuperarProveedores, RecuperarProductosPorProveedor, AgregarOrdenDeCompra,
  SeleccionarTodosLosProductos, SeleccionarTodosLosProveedores,
  EstadoProveedores} from '../Features/OrdenCompraSlice.js'
import Table from 'react-bootstrap/esm/Table.js'
import {v4 as uuidv4, v4} from 'uuid'

function FormOrdenCompra() {
  //hooks
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //state with redux
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const estadoproveedores = useSelector(EstadoProveedores)
  const productos = useSelector(SeleccionarTodosLosProductos)
  //form tools
  const {register, watch, handleSubmit, formState : {errors}, control, reset, getValues} = useForm({
    proveedor: {},
    total: 0
  })

  const {fields, append, remove, replace, prepend, update, insert} = useFieldArray({
    control,
    name: "detalles"
  })
  //hook useState
  const [descripcion, setDescripcion] = useState("")
  const [preciocompra, setPreciocompra] = useState()
  const [id, setId] = useState("")
  const [cantidad, setCantidad] = useState()
  /* const [oc,setOC] = useState({
    lineasCompra :[{
      descripcion,
      preciocompra,
      cantidad,
      subtotal: parseFloat(preciocompra*cantidad)
    }], 
    total: total
  })
   */
  let itemsInicial = {
    arreglo : [],
    total : 0
  }
  const [items, setItems] = useState(itemsInicial)
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

 /* const AgregarLineaCompra = (descripcion, preciocompra, cantidad) => {
      
    
    const lineaCompra = {
      descripcion: descripcion,
      preciocompra: preciocompra,
      cantidad: parseInt(cantidad),
      subtotal : parseFloat(preciocompra * cantidad)
    }
    console.log(lineaCompra)
    //console.log(total)
    console.log(items)
    //setOC(oc.lineasCompra.push(lineaCompra))
    /* items.arreglo.forEach( lc => {
      lc.descripcion == lineaCompra.descripcion ? 
        lc.cantidad = {...cantidad}
        :
        items.arreglo.push

    }) */
    //items.arreglo.push(lineaCompra)

    /*items.total = items.total + lineaCompra.subtotal
    console.log(items)
    const lineaencontrada = items.arreglo.find((item) => item.descripcion === lineaCompra.descripcion)
    if (lineaencontrada) {
      lineaencontrada.cantidad += lineaCompra.cantidad;
      lineaencontrada.subtotal += lineaCompra.subtotal;
    } else {
      items.arreglo.push(lineaCompra)
    }
    setItems({...items ,...total}); */

    //console.log(oc)
    /* oc.lineasCompra.forEach(lc => {
      console.log(lc)
      let subtotal = parseInt(lc.cantidad * lc.preciocompra)
      console.log(subtotal)
      setTotal(total + subtotal)
    }) 
    //setTotal(parseFloat(total + lineaCompra.subtotal))
    
  } */

  const AgregarLineaCompra = (id, descripcion, preciocompra, cantidad) => {
    console.log(...fields)
    console.log(id)
    let subtotal = parseFloat(preciocompra * cantidad)
    let item = fields.find(x => x.id_producto === id)
    if (item === undefined) {
    append({
      id_producto: id,
      descripcion : descripcion, 
      preciocompra: preciocompra, 
      cantidad : parseInt(cantidad), 
      subtotal: subtotal
    })
    } else {
      item.cantidad = parseInt(item.cantidad += cantidad)
      item.subtotal += subtotal
      replace([...fields])
    }
    let total = (getValues()["total"]===undefined?0.0:getValues()["total"])
    let proveedor = (getValues()["proveedor"]===undefined?{}:getValues()["proveedor"])
    reset({
      ...getValues(),
      total : total + cantidad * preciocompra,
      proveedor : proveedor
    })
    console.log( typeof(getValues().proveedor))
    console.log(getValues()["total"])
  }

  const QuitarLineaCompra = id_producto => {
    console.log(id_producto)
    let index = -1
    let subtotal = 0
    for(let i = 0; i<fields.length; i++) {
      if (fields[i].id_producto === id_producto){
        index = i
        subtotal = fields[i].subtotal
        break
      }
    }
    console.log(index)
    if (index !== -1) {
      console.log("linea 164")
      remove(index)
      let total_anterior = getValues()["total"]
      reset({
        ...getValues(),
        total : total_anterior - subtotal
      })
    }
    
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
      
      <Table className= 'table table-success table-bordered border-dark'
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
                setId(producto._id)
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
      <input
            style={{width: '300px'}}
            type="number" 
            placeholder="ingrese la cantidad"
            name="cantidad"
            defaultValue={cantidad}
            onChange={(e)=>{
              e.preventDefault()
              setCantidad(parseInt(e.target.value))
            }}
        />
      {/* <Input
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
      /> */}
      <Button
        onClick={(e)=>{
          e.preventDefault()
          console.log(descripcion, preciocompra, cantidad)
          AgregarLineaCompra(id, descripcion, preciocompra, cantidad);
          console.log(descripcion)
      }}
        >Agregar línea de compra
      </Button>

      <p>Descripción de la orden de compra al momento</p>
      <Table className= 'table table-success table-bordered border-dark'>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((item,index) => (
            <tr key={item.id}>
              <td>
                <Input type="text"
                    disabled={true}
                    name={`detalles.${index}.descripcion`}
                    register={register} errors={errors}>
                </Input>
                <Input
                  type="hidden"
                  name={`detalles.${index}.id_producto`}
                  register={register}
                  errors={errors}
                ></Input>
              </td>
              <td>
                <Input type="number"
                    disabled={true}
                    name={`detalles.${index}.cantidad`}
                    register={register} errors={errors}>
                </Input>
              </td>
              <td>
                <Input type="number"
                    disabled={true}
                    name={`detalles.${index}.preciocompra`}
                    register={register} errors={errors}>
                </Input>
              </td>
              <td>
                <Input type="text"
                    disabled={true}
                    name={`detalles.${index}.subtotal`}
                    register={register} errors={errors}>
                </Input>
              </td>
              <td>
                <Button 
                  variant='danger'
                  onClick={(e)=> {
                    e.preventDefault()
                    QuitarLineaCompra(item.id_producto)
                  }}
                >Quitar</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <h3>total acumulado: $ {getValues()["total"]}</h3>
          <Button variant='danger'>Vaciar Lista de ítems</Button>
        </tfoot>
      </Table>
      
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