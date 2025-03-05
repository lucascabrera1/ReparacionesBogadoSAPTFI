//la idea es, en este formulario, ver los presupuestos ingresados para diagnosticarlos
import { RecuperarPresupuestosIngresados, EstadoReparaciones, SeleccionarTodasLasReparaciones
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
    const estadoreparaciones = useSelector(EstadoReparaciones)
    const presupuestosingresados = useSelector(SeleccionarTodasLasReparaciones)

    console.log(presupuestosingresados)

    useEffect(() => {
        if (estadoreparaciones === "idle") {
            dispatch(RecuperarPresupuestosIngresados())
        }
    }, [estadoreparaciones])

    const userlogged = useSelector(selectCurrentUser)
    let iser = false
    userlogged.roles.map(rol => {
        if (rol.nombre === "Encargado de Reparaciones") iser = true
    })

    return (
        iser ? <div>
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
                    { presupuestosingresados ? 
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
                        }) : "nada"
                    }
                </tbody>
            </Table>
            <Button variant="secondary" onClick={()=> navigate("/")}>Atrás</Button>
        </div> : <div className='alert alert-danger'>
            {userlogged.nombreUsuario} no tiene el rol de encargado de reparaciones
        </div>
    )
}

export default FormPresupuestosIngresados