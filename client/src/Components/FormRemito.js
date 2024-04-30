import React from 'react'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodasLasOrdenesDeCompra, RecuperarOrdenesDeCompra, EstadoOrdenesDeCompra,
  SeleccionarTodasLasLineasDeCompra, RecuperarLineasDeCompra, EstadoLineasDeCompra,
  SeleccionarTodosLosProveedores, RecuperarProveedores, EstadoProveedores,
  AgregarRemito
} from '../Features/RemitoSlice'
/* import {
  SeleccionarTodosLosProveedores, RecuperarProveedores, EstadoProveedores
} from '../Features/OrdenCompraSlice' */
import Input from './Common/Input'
import Table from 'react-bootstrap/Table'
import {useForm, useFieldArray} from 'react-hook-form'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { NavLink, useNavigate } from 'react-router-dom'
import FormLineasCompra from './FormLineasCompra'

function FormRemito() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const ocs = useSelector(SeleccionarTodasLasOrdenesDeCompra)
  console.log(ocs)
  const lcs = useSelector(SeleccionarTodasLasLineasDeCompra)
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  console.log(proveedores)
  const estadoocs = useSelector(EstadoOrdenesDeCompra)
  const estadoproveedores = useSelector(EstadoProveedores)
  const estadolineascompra = useSelector(EstadoLineasDeCompra)
  

  const [idOc, setIdOc] = useState('')
  const [idLc, setidLc] = useState('')
  const [producto, setProducto] = useState('')
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState ('')
  const [lineasC, setLineasC] = useState([])
  const [cantidadEsperada, setCantidadEsperada] = useState(0)
  const [cantidadRecibida, setcantidadRecibida] = useState(0)
  

  const {register, handleSubmit, formState : {errors}, control, reset, getValues} = useForm({
    proveedor: {},
    fechaEmision: Date(),
    ordenCompra: {}
  })

  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "detalles"
  })

  useEffect(()=>{
    if (estadoocs==="idle"){
      dispatch(RecuperarOrdenesDeCompra())
    }
  },[estadoocs])

  useEffect(()=>{
    if (estadoproveedores==="idle"){
      dispatch(RecuperarProveedores())
    }
  },[estadoproveedores])

  useEffect(()=>{
    if (estadolineascompra==="idle"){
      dispatch(RecuperarLineasDeCompra(idOc))
    }
  },[estadolineascompra])

  console.log(ocs)
  console.log(proveedorSeleccionado)
  
  let ocsfiltradas = ocs.filter(oc =>  oc.proveedor === proveedorSeleccionado)
  console.log(ocsfiltradas)

  const optOcsFiltradas = ocsfiltradas.map(oc =>{ 
    return <option className='optOcs' key={oc._id} value={oc._id}>
      {oc._id}
    </option>
  })
  optOcsFiltradas.unshift(<option value="" key="">Seleccione</option>)
 

  const optProveedores = proveedores.map(proveedor => {
    return <option
      className='optProveedores'
      key={proveedor._id} 
      value={proveedor._id}
      onChange={e => {
        e.preventDefault()
        setProveedorSeleccionado(e.target.value)
      }}
    >
      {proveedor.razonsocial}
    </option>
  })
  optProveedores.unshift(<option value="" key="">Seleccione</option>)

  let oc = ocsfiltradas.find(x => x._id === idOc)
  console.log(oc)

  const AgregarLineaRemito = (id, idLc, cantidadesperada, cantidadrecibida) => {
    console.log(proveedorSeleccionado)
    console.log(cantidadrecibida)
    console.log(producto)
    console.log(id)
    console.log(cantidadesperada)
    if (!cantidadrecibida || cantidadrecibida< 1) {
      alert(`la cantidad es obligatoria y debe ser mayor o igual a 1, y la ingresada fue: ${cantidadrecibida}`)
      return false
    }
    if (!producto) {
      alert("no hay ninguna línea de compra seleccionada")
      return false
    }
    let item = fields.find(x => x.producto === id)
    console.log(item)
    if (item === undefined) {
    append({
      producto,
      lineaCompra : idLc,
      cantidadIngresada: cantidadRecibida,
      cantidadEsperada : cantidadesperada
    })
    } else {
      item.cantidadIngresada = item.cantidadIngresada + cantidadRecibida
      replace([...fields])
    }
    console.log(proveedorSeleccionado)
    let proveedor = (getValues()["proveedor"]===undefined ? proveedorSeleccionado : getValues()["proveedor"])
    let fechaEmision = (getValues()["fechEemision"]===undefined?Date():Date())
    let ordenCompra = (getValues()["ordenCompra"]===undefined?null: oc._id)
    reset({
      ...getValues(),
      proveedor : proveedor,
      fechaEmision : fechaEmision,
      ordenCompra : ordenCompra
    })
  }

  const QuitarLineaRemito = producto => {
    let index = -1
    let subtotal = 0
    for(let i = 0; i<fields.length; i++) {
      if (fields[i].producto === producto){
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
    //setRsp('')
    //setIdOc('')
    setLineasC([])
    setCantidadEsperada(0)
    setcantidadRecibida(0)
    //setidLc('')
    setProducto('')
    reset({
      ...getValues(),
      total : 0,
      proveedor: id_proveedor,
      ordenCompra: idOc
    })
  }

  const handleSubmitOC = async (data, e) =>  {
    if (data.detalles.length === 0) {
      alert("Al menos debe haber una linea de remito ingresada")
      return false
    }
    try {
      const result = await dispatch(AgregarRemito(data)).unwrap()
      alert('Remito guardado correctamente')
      e.target.reset()
      navigate('/remitos')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(handleSubmitOC)}>
        <select
          onChange={e => {
            e.preventDefault()
            setProveedorSeleccionado(e.target.value)
            console.log(e.target.value)
          }
        }>
          {optProveedores}
        </select>
        <select
          onChange= {async e  => { 
            e.preventDefault()
            setIdOc(e.target.value)
            LimpiarGrilla()
            let lcs = await dispatch(RecuperarLineasDeCompra(e.target.value)).unwrap()
            console.log(lcs)
            setLineasC(lcs)
          }
        }>
          {optOcsFiltradas}
        </select>
        {!oc ? <div>
          <p>Orden seleccionada:</p>
          <p>Fecha de emision: </p>
          <p>Fecha de entrega:</p>
          <p>Forma de pago: </p>
          <p>Proveedor: </p>
          <p>Estado: </p>
        </div> : <div key={oc._id}>
          <p>Orden seleccionada: {oc._id}</p>
          <p>Fecha de emision: {oc.fechaemision}</p>
          <p>Fecha de entrega: {oc.fechaentrega}</p>
          <p>Forma de pago: {oc.formapago}</p>
          <p>Proveedor: {oc.proveedor}</p>
          <p>Estado: {oc.estado}</p>
        </div>}
        
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
                  lineasC.length > 0 ? 
                    lineasC.map(item=> {
                      return( <tr 
                          key={item._id}
                          onClick={ e => {
                            e.preventDefault()
                            console.log(item)
                            setidLc(item._id)
                            setProducto(item.producto)
                            setCantidadEsperada(parseInt(item.cantidad))
                          }}
                        >
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
            <tfoot style={{backgroundColor: 'lightskyblue'}}>
              <tr>
                <th></th>
                <th></th>
                <th >Total: </th>
                <th>{!oc ? null : oc.total}</th>
                <th></th>
              </tr>
            </tfoot>
          </Table>
          <p>Seleccione una linea de compra e ingrese la cantidad ingresada</p>
          <p>Producto Seleccionado:  {!producto ? null : producto}</p>
          <input
            style={{width: '300px'}}
            type="number" 
            placeholder="ingrese la cantidad recibida"
            name="cantidad"
            min="1"
            step="1"
            required = ""
            onChange={(e)=>{
              e.preventDefault()
              console.log(typeof(e.target.value))
              console.log(parseInt(e.target.value))
              setcantidadRecibida(parseInt(e.target.value))
              console.log(cantidadRecibida)
          }}
        />
          
          <Button
            onClick={ e => {
              console.log('llega al onclick')
              console.log()
              e.preventDefault()
              console.log(cantidadRecibida)
              AgregarLineaRemito(producto, idLc, cantidadEsperada, cantidadRecibida)
              console.log(typeof(cantidadRecibida))
              console.log(idLc)
              console.log(producto)
            }}
          > Agregar Línea de Remito
          </Button>
          <Table className= 'table table-success table-bordered border-dark'>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Recibida</th>
              <th>Cantidad Esperada</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item,index) => (
              <tr key={item.id}>
                <td>
                  <Input type="text"
                      disabled={true}
                      name={`detalles.${index}.producto`}
                      register={register} 
                      errors={errors}>
                  </Input>
                  <Input
                    type="hidden"
                    name={`detalles.${index}.lineaCompra`}
                    register={register}
                    errors={errors}
                  ></Input>
                </td>
                <td style={ 
                  item.cantidadIngresada === item.cantidadEsperada  ? { 
                  backgroundColor: 'green' } : {
                  backgroundColor : 'red'
                }}>
                  <Input type="number"
                    disabled={true}
                    name={`detalles.${index}.cantidadIngresada`}
                    register={register}
                    errors={errors}>
                  </Input>
                </td>
                <td>
                  <Input type="number"
                    disabled={true}
                    name={`detalles.${index}.cantidadEsperada`}
                    register={register} 
                    errors={errors}>
                  </Input>
                </td>
                <td>
                  <Button 
                    variant='danger'
                    onClick={(e)=> {
                      e.preventDefault()
                      console.log(item.id)
                      console.log(item.producto)
                      QuitarLineaRemito(item.producto)
                    }}
                  >Quitar</Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <Button 
              variant='danger' 
              onClick={ e => {
                e.preventDefault()
                console.log('vaciar lista')
                LimpiarGrilla()
              }}
            >Vaciar Lista de ítems
            </Button>
          </tfoot>
        </Table>
        <Button 
            type='submit'
            style={{backgroundColor:'green', color:'ButtonShadow'}}
          >Generar Nuevo Remito de Compra
        </Button>
      </Form>
      <Button
        variant='secondary'
        onClick={e => { e.preventDefault(); navigate('/remitos')}}>
        ...Atrás
      </Button>
    </div>
  )
}

export default FormRemito