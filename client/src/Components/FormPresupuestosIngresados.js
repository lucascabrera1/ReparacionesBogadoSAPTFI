//la idea es, en este formulario, ver los presupuestos ingresados para diagnosticarlos
import { RecuperarPresupuestosIngresados, 
    EstadoPresupuestosIngresados, 
    SeleccionarTodosLosPresupuestosIngresados,
    ErroresPresupuestosIngresados
 } from "../Features/ReparacionesSlice";
import { useDispatch, useSelector } from 'react-redux'

import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import Table from "react-bootstrap/esm/Table";
import { useEffect } from "react";
import { selectCurrentUser } from "../Features/AuthSlice";

function FormPresupuestosIngresados() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const estadopresupuestosingresados = useSelector(EstadoPresupuestosIngresados)
    const presupuestosingresados = useSelector(SeleccionarTodosLosPresupuestosIngresados)
    const errores = useSelector(ErroresPresupuestosIngresados)

    console.log(presupuestosingresados)

    useEffect(() => {
        if (estadopresupuestosingresados === "idle") {
            dispatch(RecuperarPresupuestosIngresados())
        }
    }, [estadopresupuestosingresados])

    const userlogged = useSelector(selectCurrentUser)
    let iser = false
    userlogged.roles.map(rol => {
        if (rol.nombre === "Encargado de Reparaciones") iser = true
        return iser
    })

    return (
        !iser ? <div className='alert alert-danger'>
            {userlogged.nombreUsuario} no tiene el rol de encargado de reparaciones
        </div> :
        errores ? <div className='alert alert-danger'>
            {errores} 
        </div> : <div>
            <Table className= 'table table-success table-bordered border-dark'>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Falla que presenta</th>
                        <th>Fecha de Ingreso</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Diagnosticar</th>
                    </tr>
                </thead>
                <tbody>
                    { Array.isArray(presupuestosingresados) ? 
                        presupuestosingresados.map(pres => {
                            return <tr key={pres._id}>
                                <td>{pres.codigo}</td>
                                <td>{pres.cliente}</td>
                                <td>{pres.estado}</td>
                                <td>{pres.falla}</td>
                                <td>{pres.fechaIngreso}</td>
                                <td>{pres.marca}</td>
                                <td>{pres.modelo}</td>
                                <td><Button onClick={()=> navigate(`/diagnosticar/${pres._id}`)}>Diagnosticar</Button></td>
                            </tr>
                        }) :  <tr key={presupuestosingresados._id}>
                                <td>{presupuestosingresados.codigo}</td>
                                <td>{presupuestosingresados.cliente}</td>
                                <td>{presupuestosingresados.estado}</td>
                                <td>{presupuestosingresados.falla}</td>
                                <td>{presupuestosingresados.fechaIngreso}</td>
                                <td>{presupuestosingresados.marca}</td>
                                <td>{presupuestosingresados.modelo}</td>
                                <td><Button onClick={()=> navigate(`/diagnosticar/${presupuestosingresados._id}`)}>Diagnosticar</Button></td>
                            </tr>
                    }
                </tbody>
            </Table>
            <Button 
                variant="secondary" 
                onClick={(e)=> {
                    e.preventDefault()
                    dispatch(RecuperarPresupuestosIngresados())
                    navigate("/")
                }}
            >
                    Atrás
            </Button>
        </div>
    )
}

export default FormPresupuestosIngresados