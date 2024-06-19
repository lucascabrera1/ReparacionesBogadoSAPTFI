import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, NavLink, useParams} from 'react-router-dom'
import {useForm, useFieldArray} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import Form from 'react-bootstrap/Form'
import {RecuperarProveedores, RecuperarProductosPorProveedor, RecuperarFormasDePago, AgregarOrdenDeCompra,
  SeleccionarTodosLosProductos, SeleccionarTodosLosProveedores, SeleccionarTodasLasFormasDePago,
  EstadoProveedores, EstadoFormasDePago} from '../Features/OrdenCompraSlice.js'
import Table from 'react-bootstrap/esm/Table.js'
import { toFormData } from 'axios'


function FormOrdenCompra() {
  //hooks
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //state with redux
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const estadoproveedores = useSelector(EstadoProveedores)
  const productos = useSelector(SeleccionarTodosLosProductos)
  const formasdepago = useSelector(SeleccionarTodasLasFormasDePago)
  const estadoformasdepago = useSelector(EstadoFormasDePago)
  //form tools
  const {register, handleSubmit, formState : {errors}, control, reset, getValues} = useForm({
    proveedor: {},
    total: 0,
    fechaEmision: Date(),
    fechaEntrega: "",
    formaDePago: ""
  })

  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "detalles"
  })
  //hook useState
  const [descripcion, setDescripcion] = useState("")
  const [preciocompra, setPreciocompra] = useState()
  const [id, setId] = useState("")
  const [cantidad, setCantidad] = useState()
  
  let itemsInicial = {
    arreglo : [],
    total : 0
  }

  const [items, setItems] = useState(itemsInicial)
  
  useEffect(()=>{
    if (estadoproveedores==="idle"){
      dispatch(RecuperarProveedores())
    }
  },[estadoproveedores])

  useEffect (()=> {
    if (estadoformasdepago === "idle") {
      dispatch(RecuperarFormasDePago())
    }
  }, [estadoformasdepago])
 
  const optionProveedores = proveedores.map(p => (<option
    value={p._id} 
    key={p._id}
    >{p.razonsocial}
  </option>))

  optionProveedores.unshift(<option value="" key="">Seleccione</option>)

  const optionFormasDePago = formasdepago.map(p => <option
    value={p._id}
    key={p._id}
  >{p.descripcion}</option>)

  optionFormasDePago.unshift(<option value="" key="">Seleccione</option>)

  const AgregarLineaCompra = (id, descripcion, preciocompra, cantidad) => {
    if (!cantidad || cantidad< 1) {
      alert("la cantidad es obligatoria y debe ser mayor o igual a 1")
      return false
    }
    if (!descripcion) {
      alert("no hay ningun producto seleccionado")
      return false
    }
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
    let fechaEmision = (getValues()["fechEemision"]===undefined?Date():Date())
    reset({
      ...getValues(),
      total : total + cantidad * preciocompra,
      proveedor : proveedor,
      fechaEmision : fechaEmision
    })
  }

  const QuitarLineaCompra = id_producto => {
    let index = -1
    let subtotal = 0
    for(let i = 0; i<fields.length; i++) {
      if (fields[i].id_producto === id_producto){
        index = i
        subtotal = fields[i].subtotal
        break
      }
    }
    if (index !== -1) {
      remove(index)
      let total_anterior = getValues()["total"]
      reset({
        ...getValues(),
        total : total_anterior - subtotal
      })
    }
  }

  const LimpiarGrilla = (id_proveedor) => {
    remove()
    setDescripcion("")
    setPreciocompra()
    setId("")
    reset({
      ...getValues(),
      total : 0,
      proveedor: id_proveedor
    })
  }

  const handleSubmitLC = (data) => {
    setCantidad(parseInt(data.cantidad))
  }

  const handleSubmitOC = async (data, e) =>  {
    if (data.detalles.length === 0) {
      alert("Al menos debe haber una linea de compra ingresada")
      return false
    }
    try {
      const result = await dispatch(AgregarOrdenDeCompra(data)).unwrap()
      alert('orden de compra guardada correctamente')
      e.target.reset()
      navigate('/ordenesdecompra')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <br/>
      Acá voy a generar UNA orden de compra
      <Form onSubmit={handleSubmit(handleSubmitOC)} style={{border: '2px solid black'}}>
        <label>Proveedor</label>
        <Form.Select
          aria-label='Proveedor'
          className='col-md-2'
          size='sm'
          name='proveedor'
          {...register('proveedor')}
          onChange={(e) => {
            e.preventDefault()
            if (fields.length>0) alert("No se pueden ordenar productos de otros proveedores")
            LimpiarGrilla(e.target.value)
            dispatch(RecuperarProductosPorProveedor(e.target.value))
          }}
        >
          {optionProveedores}
        </Form.Select>
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
          {productos.map( producto => {
            return <tr 
              key={producto._id} 
              onClick={e=> {
                e.preventDefault()
                setDescripcion(producto.descripcion)
                setPreciocompra(producto.preciocompra)
                setId(producto._id)
            }}>
              <td>{producto.descripcion}</td>
              <td>{producto.categoria}</td>
              <td>{producto.proveedor.razonsocial}</td>
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
        min="1"
        step="1"
        required = ""
        onChange={(e)=>{
          e.preventDefault()
          setCantidad(parseInt(e.target.value))
        }}
      />
      <Button
        onClick={(e)=>{
          e.preventDefault()
          AgregarLineaCompra(id, descripcion, preciocompra, cantidad);
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
          <p>total acumulado: $ {getValues()["total"]}</p>
          <Button variant='danger' onClick={()=>LimpiarGrilla()}>Vaciar Lista de ítems</Button>
        </tfoot>
      </Table>
      <Input
        type="date"
        register={register}
        name="fechaEntrega"
        registerOptions={{
          required: true,
          validate: (value, formValues) => {
            let fechaEntrega = new Date(value)
            let fechaactual = new Date()
            if (fechaEntrega<fechaactual) {
              return false
            } else return true
          }
        }}
        optionMsgErrors={{
          required : "La fecha de entrega es obligatoria",
          validate: "La fecha debe ser posterior a hoy"
        }}
        errors={errors}
        label="fecha esperada de entrega"
      />
      <label>Forma de Pago</label>
      <Form.Select 
        aria-label='FormaPago'
        className='col-md-2'
        size='sm'
        name='formaDePago'
        {...register('formaDePago', {required: true})}
        onChange={(e) => {
          e.preventDefault()
        }}>
          {optionFormasDePago}
      </Form.Select>
      {errors["formaDePago"]?.type === "required" && <><span style={{color: "red"}} >Es obligatorio ingresar una forma de pago</span><br/></>}
      <Button type='submit'>Generar nueva orden de compra</Button>
      </Form>
      <Button
        variant='secondary'
        onClick={e => { e.preventDefault(); navigate('/todaslasordenesdecompra')}}>
        ...Atrás
      </Button>
    </div>
  )
}

export default FormOrdenCompra