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
import {SeleccionarTodasLasFormasDePago, SeleccionarTodosLosProductos, 
  EstadoFormasDePago, EstadoProductos, 
  ErroresFormasDePago, ErroresProductos, 
  RecuperarFormasDePago, RecuperarProductos} from '../Features/OrdenCompraSlice.js'

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
  const productos = useSelector(SeleccionarTodosLosProductos)

  console.log(clientes)
  console.log(productos)
  console.log(fps)

  const estadoclientes = useSelector(Estadoclientes)
  const estadofps = useSelector(EstadoFormasDePago)
  const estadoproductos = useSelector(EstadoProductos)

  const erroresclientes = useSelector(ErroresClientes)
  const erroresfps = useSelector(ErroresFormasDePago)
  const erroresproductos = useSelector(ErroresProductos)

  const [descripcion, setDescripcion] = useState("")
  const [precioventa, setPrecioVenta] = useState()
  const [id, setId] = useState("")
  const [cantidad, setCantidad] = useState()

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

  const optionClientes = clientes.map(cliente => (<option
    value={cliente._id} 
    key={cliente._id}
    >{cliente.razonsocial}
  </option>))

  optionClientes.unshift(<option value="" key="">Seleccione</option>)

  const optionFormasDePago = fps.map(fp => <option
    value={fp._id}
    key={fp._id}
  >{fp.descripcion}</option>)

  optionFormasDePago.unshift(<option value="" key="">Seleccione</option>)

  const AgregarLineaVenta = (id, descripcion, precioventa, cantidad) => {
    if (!cantidad || cantidad< 1) {
      alert("la cantidad es obligatoria y debe ser mayor o igual a 1")
      return false
    }
    if (!descripcion) {
      alert("no hay ningun producto seleccionado")
      return false
    }
    let subtotal = parseFloat(precioventa * cantidad)
    let item = fields.find(x => x.id_producto === id)
    if (item === undefined) {
      append({
        id_producto: id,
        descripcion : descripcion, 
        precioventa: precioventa, 
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
        total : total + cantidad * precioventa,
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
    setDescripcion("")
    setPrecioVenta()
    setId("")
    reset({
      ...getValues(),
      total : 0,
      proveedor: id_proveedor
    })
  }

  const handleSubmitVenta = async (data, e) =>  {
      if (data.detalles.length === 0) {
        alert("Al menos debe haber una linea de venta ingresada")
        return false
      }
      try {
        const result = await dispatch(AgregarVenta(data)).unwrap()
        console.log(result)
        alert('venta guardada correctamente')
        e.target.reset()
        
        navigate('/ventas')
        //dispatch (RecuperarOrdenesDeCompra())
      } catch (error) {
        console.error(error)
      }
    }

  return erroresclientes?<div className='alert alert-danger'>{erroresclientes}</div>:
  erroresfps?<div className='alert alert-danger'>{erroresfps}</div>:
  erroresproductos?<div className='alert alert-danger'>{erroresproductos}</div>:<div>
    <h1>Nueva Venta</h1>
    <h2>Clientes</h2>
    {
      clientes.map(cliente => <p key={cliente._id}>
        {cliente.nombreyapellido}
      </p>)
    }
    <h2>Formas de Pago</h2>
    {
      fps.map(fp => <p key={fp._id}>
        {fp.descripcion}
      </p>)
    }
    <h2>Productos</h2>
    {
      productos.map(producto => <p key={producto._id}>
        {producto.descripcion}
      </p>)
    }
  </div>
}

export default FormVenta