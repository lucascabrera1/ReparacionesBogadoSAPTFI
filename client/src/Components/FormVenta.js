import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, NavLink, useParams} from 'react-router-dom'
import {useForm, useFieldArray} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/esm/Table.js'
import { SeleccionarTodosLosClientes, Estadoclientes, ErroresClientes, 
  RecuperarClientes,
  AgregarVenta} from '../Features/VentaSlice.js'
import {SeleccionarTodasLasFormasDePago, SeleccionarProductosParaVenta, 
  SeleccionarTodasLasMarcas, SeleccionarTodasLasCategorias,
  EstadoFormasDePago, EstadoProductos, EstadoMarcas, EstadoCategorias,
  ErroresFormasDePago, ErroresProductos, ErroresMarcas, ErroresCategorias,
  RecuperarFormasDePago, RecuperarProductos, RecuperarMarcas, RecuperarCategorias
} from '../Features/OrdenCompraSlice.js'

function FormVenta() {

  const {register, handleSubmit, formState : {errors}, control, reset, getValues} = useForm({
    cliente: {},
    total: 0,
    fechaEmision: Date(),
    formaDePago: ""
  })

  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "detalles"
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const clientes = useSelector(SeleccionarTodosLosClientes)
  const fps = useSelector(SeleccionarTodasLasFormasDePago)
  const productos = useSelector(SeleccionarProductosParaVenta)
  const marcas = useSelector(SeleccionarTodasLasMarcas)
  const categorias = useSelector(SeleccionarTodasLasCategorias)

  const estadoclientes = useSelector(Estadoclientes)
  const estadofps = useSelector(EstadoFormasDePago)
  const estadoproductos = useSelector(EstadoProductos)
  const estadomarcas = useSelector(EstadoMarcas)
  const estadocategorias = useSelector(EstadoCategorias)

  const erroresclientes = useSelector(ErroresClientes)
  const erroresfps = useSelector(ErroresFormasDePago)
  const erroresproductos = useSelector(ErroresProductos)
  const erroresmarcas = useSelector(ErroresMarcas)
  const errorescategorias = useSelector(ErroresCategorias)

  console.log(clientes)
  console.log(productos)

  //const [descripcion, setDescripcion] = useState("")
  //const [precioventa, setPrecioVenta] = useState()
  //const [id, setId] = useState("")
  const [idMarca, setIdMarca] = useState("")
  const [idCategoria, setIdCategoria] = useState("")
  const [cantidad, setCantidad] = useState(1)
  
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState({})

  /* const [productosFiltradosPorMarca, setProductosFiltradosPorMarca] = useState([])
  const [productosFiltradosPorCategoria, setProductosFiltradosPorCategoria] = useState([]) */

  //console.log(descripcion, cantidad, id, precioventa)

  useEffect(()=> {
    if (estadoclientes === "idle") {
      dispatch(RecuperarClientes())
    }
  }, [estadoclientes])

  useEffect(()=> {
    if (estadofps === "idle") {
      dispatch(RecuperarFormasDePago())
    }
  }, [estadofps])

  useEffect(()=> {
    if (estadoproductos === "idle") {
      dispatch(RecuperarProductos())
    }
  }, [estadoproductos])

  useEffect(()=> {
    if (productos && productos.length > 0) {
      setProductosFiltrados(productos)
    }
  }, [productos])
 
  useEffect(() => {
    if (estadomarcas === "idle") {
      dispatch(RecuperarMarcas())
    }
  })

  useEffect(() => {
    if (estadocategorias === "idle") {
      dispatch(RecuperarCategorias())
    }
  })

  const optionClientes = clientes.map(cliente => (<option
    value={cliente._id} 
    key={cliente._id}
    >{cliente.nombreyapellido}
  </option>))

  optionClientes.unshift(<option value="" key="">Seleccione</option>)

  const optionFormasDePago = fps.map(fp => <option
    value={fp._id}
    key={fp._id}
  >{fp.descripcion}</option>)

  optionFormasDePago.unshift(<option value="" key="">Seleccione</option>)

  const optionMarcas = marcas.map(m => <option
    value={m._id}
    key={m._id}
  >
    {m.nombre}
  </option>)

  optionMarcas.unshift(<option value="" key="">Todas</option>)

  const optionCategorias = categorias.map(cat => <option
    value={cat._id}
    key={cat._id}
  >
    {cat.descripcion}
  </option>)

  optionCategorias.unshift(<option value="" key="">Todas</option>)

  const AgregarLineaVenta = (id, cantidad) => {
    if (!cantidad || cantidad< 1) {
      alert("la cantidad es obligatoria y debe ser mayor o igual a 1")
      return false
    }
    if (!productoSeleccionado.descripcion) {
      alert("no hay ningun producto seleccionado")
      return false
    }
    
    
    let subtotal = parseFloat(productoSeleccionado.precioventa * cantidad)
    console.log(id)
    let item = fields.find(x => x.id_producto === id)
    console.log(productoSeleccionado)
    console.log(item)
    //if (item) {
      if (productoSeleccionado.stock<cantidad + (item?item.cantidad:0)) {
        alert ("stock insuficiente")
        return false
      } 
    /*} else {
      if (productoSeleccionado.stock < cantidad) {
        alert ("stock insuficiente")
        return false
      }
    }*/
    if (item === undefined) {
      append({
        id_producto: id,
        descripcion : productoSeleccionado.descripcion, 
        precioventa: productoSeleccionado.precioventa, 
        cantidad : parseInt(cantidad), 
        subtotal: subtotal
      })
      } else {
        item.cantidad = parseInt(item.cantidad += cantidad)
        item.subtotal += subtotal
        replace([...fields])
      }
      let total = (getValues()["total"]===undefined?0.0:getValues()["total"])
      let proveedor = (getValues()["cliente"]===undefined?{}:getValues()["cliente"])
      let fechaEmision = (getValues()["fechEemision"]===undefined?Date():Date())
      reset({
        ...getValues(),
        total : total + cantidad * productoSeleccionado.precioventa,
        proveedor : proveedor,
        fechaEmision : fechaEmision
      })
  }

  const QuitarLineaVenta = id_producto => {
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
    //setDescripcion("")
    //setPrecioVenta()
    //setId("")
    setProductoSeleccionado({})
    reset({
      ...getValues(),
      total : 0,
      proveedor: id_proveedor
    })
  }

  const handleSubmitVenta = async (data, e) =>  {
    console.log(data)
    if (data.detalles.length === 0) {
      alert("Al menos debe haber una linea de venta ingresada")
      return false
    }
    try {
      const result = await dispatch(AgregarVenta(data)).unwrap()
      console.log(result)
      if (result.error) {
        alert(result.message)
        navigate('/nuevaventa')
      } else {
        alert('venta guardada correctamente')
        navigate('/ventas')
      }
    } catch (error) {
      alert(error)
    }
  }

  /* const filtrarProductosPorMarca = (idmarca) => {
    if (idmarca){
      const {nombre} = marcas.find(marca => marca._id === idmarca)
      const productospormarca = productos.filter(producto =>  producto.marca === nombre)
      return productospormarca
    } else return productos
  }

  const filtrarProductosPorCategoria = (idcat) => {
    console.log(idcat)
    if (idcat) {
      const {descripcion} = categorias.find(cat => cat._id === idcat)
      const productosporcategoria = productosFiltradosPorMarca.filter(producto => producto.categoria === descripcion)
      console.log(productosporcategoria)
      return productosporcategoria
    } else return productosFiltradosPorMarca
  } */

  const filtros = {idCategoria, idMarca}

  const filtrarProductos = (idMarca, idCategoria) => {
    //return productos
    console.log(marcas)
    console.log(idMarca, idCategoria)
    if (idCategoria) {
      //pfxc = productos filtrados por categoria
      const {descripcion} = categorias.find(cat => cat._id === idCategoria)
      console.log(descripcion)
      const pfxc = productos.filter(producto => producto.categoria === descripcion)
      return pfxc
    } if (idMarca) {
      //pfxm = productos filtrados por marca
      const {nombre} = marcas.find(marca => marca._id === idMarca)
      console.log(nombre)
      const pfxm = productos.filter(producto =>  producto.marca === nombre)
      return pfxm
    } if (idMarca & idCategoria) {
      //pfxmyc = productos filtrados por marca y categoria
      const {descripcion} = categorias.find(cat => cat._id === idCategoria)
      const {nombre} = marcas.find(marca => marca._id === idMarca)
      const pfxmyc = productos.filter(producto =>  producto.marca === nombre & producto.categoria === descripcion)
      return pfxmyc
    } else return productos
  }

  return erroresclientes?<div className='alert alert-danger'>{erroresclientes}</div>:
  erroresfps?<div className='alert alert-danger'>{erroresfps}</div>:
  erroresmarcas?<div className='alert alert-danger'>{erroresmarcas}</div>:
  erroresproductos?<div className='alert alert-danger'>{erroresproductos}</div>:
  errorescategorias?<div className='alert alert-danger'>{errorescategorias}</div>:<div>
    <Form onSubmit={handleSubmit(handleSubmitVenta)} style={{border: '2px solid black'}}>
      <Input
        type="number"
        name="codigo"
        placeholder="Código"
        register={register}
        registerOptions= {{required: true, minLength: 1, maxLength: 4, min: 0}}
        optionMsgErrors={{
          required: "El codigo es obligatorio",
          minLength : "Minimo 1 digito",
          maxLength : "Máximo 4 dígitos",
          min: "El valor debe ser mayor o igual a 0"
        }}
        errors={errors}
      />
      <label>Seleccione un cliente</label>
      <Form.Select
        aria-label='Cliente'
        className='col-md-2'
        size='sm'
        name='cliente'
        {...register('cliente')}
      >
        {optionClientes}
      </Form.Select>
      <label>Seleccione una forma de pago</label>
      <Form.Select
        aria-label='Forma de pago'
        className='col-md-2'
        size='sm'
        name='formaDePago'
        {...register('formaDePago')}
      >
        {optionFormasDePago}
      </Form.Select>
      <br/>
      <label>Marca</label>
      <Form.Select
          aria-label='Marca'
          className='col-md-2'
          size='sm'
          name='marca'
          {...register('marca')}
          onChange={(e) => {
            e.preventDefault()
            setIdMarca(e.target.value)
            const productosfiltradospormarca = filtrarProductos(e.target.value, idCategoria)
            console.log(productosfiltradospormarca)
            setProductosFiltrados(productosfiltradospormarca)
          }}
        >
          {optionMarcas}
        </Form.Select>
      <label>Categoría</label>
      <Form.Select
          aria-label='Categoria'
          className='col-md-2'
          size='sm'
          name='categoria'
          {...register('categoria')}
          onChange={(e) => {
            e.preventDefault()
            setIdCategoria(e.target.value)
            const productosfiltrados = filtrarProductos(idMarca, e.target.value)
            setProductosFiltrados(productosfiltrados)
          }}
        >
          {optionCategorias}
        </Form.Select>
        <p>Seleccione un producto de la grilla haciendo clic en el mismo</p>
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
            productosFiltrados.length> 0 ? 
            productosFiltrados.map( producto => {
            return <tr 
              key={producto._id} 
              onClick={e=> {
                e.preventDefault()
                //setDescripcion(producto.descripcion)
                //setPrecioVenta(producto.precioventa)
                //setId(producto._id)
                setProductoSeleccionado(producto)
            }}>
              <td>{producto.descripcion}</td>
              <td>{producto.categoria}</td>
              <td>{producto.proveedor}</td>
              <td>{producto.marca}</td>
              <td>{producto.codigo}</td>
              <td>{producto.preciocompra}</td>
              <td>{producto.precioventa}</td>
              <td>{producto.puntopedido}</td>
              <td 
              style={
                producto.stock < producto.puntopedido ? 
                {backgroundColor : 'red'} : {backgroundColor : 'greenyellow'}
              }>{producto.stock}
              </td>
            </tr>
          }) : <div>no hay ningun producto para la marca y categoria seleccionadas</div>}
        </tbody>
      </Table>
      <p>Producto seleccionado: {productoSeleccionado.descripcion}</p>
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
          AgregarLineaVenta(productoSeleccionado._id, cantidad);
      }}>
        Agregar línea de venta
      </Button>
      <p>Descripción de la venta al momento</p>
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
                <Input 
                  type="text"
                  disabled={true}
                  name={`detalles.${index}.descripcion`}
                  register={register} 
                  errors={errors}
                />
                <Input
                  type="hidden"
                  name={`detalles.${index}.id_producto`}
                  register={register}
                  errors={errors}
                />
              </td>
              <td>
                <Input 
                  type="number"
                  disabled={true}
                  name={`detalles.${index}.cantidad`}
                  register={register} errors={errors}
                />
              </td>
              <td>
                <Input 
                  type="number"
                  disabled={true}
                  name={`detalles.${index}.precioventa`}
                  register={register} 
                  errors={errors}
                />
              </td>
              <td>
                <Input 
                  type="text"
                  disabled={true}
                  name={`detalles.${index}.subtotal`}
                  register={register} 
                  errors={errors}
                />
              </td>
              <td>
                <Button 
                  variant='danger'
                  onClick={(e)=> {
                    e.preventDefault()
                    QuitarLineaVenta(item.id_producto)
                  }}
                >Quitar</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td style={{backgroundColor: 'greenyellow'}}>Total acumulado: $ </td>
            <td style={{backgroundColor: 'greenyellow'}}>{getValues()["total"]}</td>
          </tr>
          <Button  variant='danger' onClick={()=>LimpiarGrilla()}>Vaciar Lista de ítems</Button>
          <Button 
            type='submit' 
            style={{
              backgroundColor: 'green',
              textAlign: 'right'
            }}
          >
            Generar nueva venta
          </Button>
        </tfoot>
      </Table>
      
    </Form>
    <Button
        variant='secondary'
        onClick={e => { e.preventDefault(); navigate('/ventas')}}>
        ...Atrás
      </Button>
  </div>
}

export default FormVenta