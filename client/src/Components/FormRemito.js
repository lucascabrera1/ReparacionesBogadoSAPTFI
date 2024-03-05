import React from 'react'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodasLasOrdenesDeCompra, RecuperarOrdenesDeCompra, EstadoOrdenesDeCompra,
  SeleccionarTodosLosProveedores, RecuperarProveedores, EstadoProveedores,
  SeleccionarTodasLasLineasDeCompra, RecuperarLineasDeCompra, EstadoLineasDeCompra
} from '../Features/RemitoSlice'
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
  const estadoocs = useSelector(EstadoOrdenesDeCompra)
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const estadoproveedores = useSelector(EstadoProveedores)
  const estadolineascompra = useSelector(EstadoLineasDeCompra)
  const [rsp, setRsp] = useState('')
  const [idOc, setIdOc] = useState('')
  const [lineasC, setLineasC] = useState([])
  //const {register, handleSubmit, formState : {errors}} = useForm()

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
  
  console.log(lcs)
  console.log(ocs)
  let ocsfiltradas = ocs.filter(oc => oc.proveedor === rsp)
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
      value={proveedor.razonsocial}
    >
      {proveedor.razonsocial}
    </option>
  })
  optProveedores.unshift(<option value="" key="">Seleccione</option>)

  let oc = ocsfiltradas.find(x => x._id === idOc)
  console.log(oc)

  return (
    <div>
      <select
        onChange={e => {
          e.preventDefault()
          setRsp(e.target.value)
        }
      }>
        {optProveedores}
      </select>
      <select
        onChange= {async e  => { 
          e.preventDefault()
          setIdOc(e.target.value)
          let lcs = await dispatch(RecuperarLineasDeCompra(e.target.value)).unwrap()
          console.log(lcs)
          setLineasC(lcs)
        }
      }>
        {optOcsFiltradas}
      </select>
      {!oc ? null : <div key={oc._id}>
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
        <Input
          type="number"
          name="cantidadingresada"
          placeholder="Cantidad ingresada"
          register={register}
          registerOptions= {{
              required: true, maxLength: 5, minLength: 1
          }}
          errors= {errors}
          optionMsgErrors={{
              required: "el código es obligatorio",
              maxLength: "no puede incluir mas de 5 caracteres",
              minLength: "al menos 1 caracter "
          }}
        />
        <Button>Agregar Línea de Remito</Button>
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
                    //QuitarLineaCompra(item.id_producto)
                  }}
                >Quitar</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <p>total acumulado: $ {getValues()["total"]}</p>
          <Button variant='danger' onClick={console.log('vaciar lista')}>Vaciar Lista de ítems</Button>
        </tfoot>
      </Table>
    </div>
  )
}

export default FormRemito