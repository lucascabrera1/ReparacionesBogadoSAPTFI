import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {
    RecuperarClientes, RecuperarVentas,
    SeleccionarTodasLasVentas, SeleccionarTodosLosClientes,
    ErroresVentas, ErroresClientes,
    EstadoVentas, Estadoclientes
} from '../Features/VentaSlice.js'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import { formatHumanDateTime, formatHumanDate } from '../Util/DateFormat.js'

function FormVentas() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const erroresventas = useSelector(ErroresVentas)
    const erroresclientes = useSelector(ErroresClientes)

    const clientes = useSelector(SeleccionarTodosLosClientes)
    const ventas = useSelector(SeleccionarTodasLasVentas)
    
    const estadoventas = useSelector(EstadoVentas)
    const estadoclientes = useSelector(Estadoclientes)

    useEffect(()=> {
        dispatch(RecuperarClientes())
    }, [])

    useEffect(()=> {
        if (estadoclientes === "idle") {
            dispatch(RecuperarClientes())
        }
    },[estadoclientes])
    
    useEffect(()=> {
        if (estadoventas === "idle") {
            dispatch(RecuperarVentas())
        }
    },[estadoventas])

    console.log(clientes)
    console.log(ventas)

    return erroresventas ? <div className='alert alert-danger'>{erroresventas}</div> :
    erroresclientes ? <div className='alert alert-danger'>{erroresclientes}</div> : <div>
        <h1>Todas las Ventas generadas hasta el momento</h1>
        <Table className= 'table table-success table-bordered border-dark'>
            <thead>
            <tr>
                <th>Código</th>
                <th>Fecha de emisión</th>
                <th>Cliente</th>
                <th>Forma de Pago</th>
                <th>Total</th>
                <th>Detalles</th>
            </tr>
            </thead>
            <tbody>
            {
                ventas.map( venta => {
                return <tr key={venta._id}>
                    <td>{venta.codigo}</td>
                    <td>{formatHumanDate(venta.fechaEmision)}</td>
                    <td>{venta.cliente}</td>
                    <td>{venta.formaDePago}</td>
                    <td>{venta.total}</td>
                    <td><NavLink to={`/ventas/venta/${venta._id}`}> Ver Detalles...</NavLink></td>
                </tr>
                }
                )
            }
            </tbody>
        </Table>
        <Button
            variant='primary'
            size='lg'
            onClick={e => {
            e.preventDefault()
            navigate('/nuevaventa')
            }}
        >
            Nueva Venta
        </Button>
        <Button
            size='lg'
            variant='secondary' 
            onClick={e => {
            e.preventDefault() 
            navigate('/')
            }}>
            ...Atrás
        </Button>
    </div>
}

export default FormVentas