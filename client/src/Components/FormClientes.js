import { useDispatch, useSelector } from 'react-redux'
import {NavLink, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import ButtonApp from './Common/Button.js'
import Table from 'react-bootstrap/Table'
import {RecuperarClientes, Estadoclientes, SeleccionarTodosLosClientes, 
EliminarCliente, ErroresClientes} from '../Features/VentaSlice.js'

function FormClientes() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const errorescliente = useSelector(ErroresClientes)
    const clientes = useSelector(SeleccionarTodosLosClientes)
    const estadoclientes = useSelector(Estadoclientes)

    useEffect(()=> {
        if (estadoclientes === "idle") {dispatch(RecuperarClientes())}
    }, [estadoclientes])

    const handleDelete = (_id, nombre) => {
        let ok = window.confirm(`¿Está seguro de que quiere eliminar al cliente: ${nombre}?`)
        if (ok) dispatch(EliminarCliente(_id))
    }

    const handleEdit = (_id) => {
        navigate(`/clientes/${_id}`)
    }

    return errorescliente ? (<div className='alert alert-danger'>{errorescliente}</div>) : (<div>
        <h2>Todos los clientes</h2>
        {
            <Table className= 'table table-success table-bordered border-dark table-sm'>
                <thead className='table-dark'>
                    <tr>
                        <th>Nombre y Apellido</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th>Localidad</th>
                        <th>Documento</th>
                        <th>Dirección</th>
                        <th>Modificar / Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        clientes.map(cliente => {
                            return <tr key={cliente._id}>
                                <td>{cliente.nombreyapellido}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.localidad}</td>
                                <td>{cliente.dni}</td>
                                <td>{cliente.direccion}</td>
                                <td>
                                    <ButtonApp 
                                        variant='primary'
                                        onClick={()=> handleEdit(cliente._id)}>
                                            Modificar
                                    </ButtonApp>
                                    <ButtonApp variant='danger' 
                                    onClick={()=> handleDelete(cliente._id, cliente.nombreyapellido)}>
                                        Eliminar
                                    </ButtonApp> {' '}
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
        }
        <ButtonApp 
        onClick={ e => { e.preventDefault(); navigate('/nuevocliente')}}
        variant='info' size='lg'>
            Agregar
        </ButtonApp> {' '}
        <NavLink onClick={e => { e.preventDefault(); navigate('/')}}>...Atrás</NavLink>
    </div>)
}

export default FormClientes