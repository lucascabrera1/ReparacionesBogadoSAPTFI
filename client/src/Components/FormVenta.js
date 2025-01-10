import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, NavLink, useParams} from 'react-router-dom'
import {useForm, useFieldArray} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/esm/Table.js'
import { SeleccionarTodosLosClientes, SeleccionarTodasLasVentas, EstadoVentas, 
    Estadoclientes } from '../Features/VentaSlice.js'

function FormVenta() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const clientes = useSelector(SeleccionarTodosLosClientes)
    const ventas = useSelector(SeleccionarTodasLasVentas)
    const estadoventas = useSelector(EstadoVentas)
    const estadoclientes = useSelector(Estadoclientes)

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

    return (
        <div>FormVenta</div>
    )
}

export default FormVenta