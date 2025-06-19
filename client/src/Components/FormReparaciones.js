import {RecuperarTodosLosPresupuestos, EstadoPresupuestos,
    ErroresPresupuestos, SeleccionarTodosLosPresupuestos } from "../Features/ReparacionesSlice"
import { selectCurrentUser } from "../Features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import ButtonApp from "../Components/Common/Button";
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'


function FormReparaciones() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const estadopresupuestos = useSelector(EstadoPresupuestos)
    const reparaciones = useSelector(SeleccionarTodosLosPresupuestos)
    const userlogged = useSelector(selectCurrentUser)
    const errorespresupuestos = useSelector(ErroresPresupuestos)

    console.log(userlogged)
    console.log(reparaciones)
    console.log(estadopresupuestos)
    console.log(errorespresupuestos)

    useEffect( () => {
        async function RecuperarTodasLasReparaciones () {
            if (estadopresupuestos === "idle") {
                const result = await dispatch(RecuperarTodosLosPresupuestos()).unwrap()
                console.log(result)
            }
        }
        RecuperarTodasLasReparaciones()
    }, [estadopresupuestos])

    let iser = false
    userlogged.roles.map(rol => {
        if (rol.nombre === "Encargado de Reparaciones") iser = true
        return iser
    })


    return (
        errorespresupuestos ? <div className='alert alert-danger'>
            {errorespresupuestos}
        </div> :
        !iser ? <div className='alert alert-danger'>
            {userlogged.nombreUsuario} no tiene el rol de encargado de reparaciones
        </div> : <div>
            <h2>Todos los presupuestos y reparaciones hasta el momento</h2>
            <Form className='d-flex flex-column justify-content-md-center align-items-center text-center'>
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
                            <th>Diagnóstico</th>
                            <th>Precio Aproximado</th>
                            <th>Fecha Aproximada de Entrega</th>
                            <th>Fecha de Reparación</th>
                            <th>Precio Final</th>
                            <th>Fecha de Retiro</th>
                            <th>Forma de Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reparaciones.map(rep => {
                                return <tr key={rep._id}>
                                    <td>{rep.codigo}</td>
                                    <td>{rep.cliente}</td>
                                    <td>{rep.estado}</td>
                                    <td>{rep.falla}</td>
                                    <td>{rep.fechaIngreso}</td>
                                    <td>{rep.marca}</td>
                                    <td>{rep.modelo}</td>
                                    <td>{rep.diagnostico ? rep.diagnostico : "Pendiente"}</td>
                                    <td>{rep.precioAproximado ? rep.precioAproximado : "Pendiente"}</td>
                                    <td>{rep.fechaAproxEntrega ? rep.fechaAproxEntrega : "Pendiente"}</td>
                                    <td>{rep.fechaEntrega ? rep.fechaEntrega : "Pendiente"}</td>
                                    <td>{rep.precio ? rep.precio : "Pendiente"}</td>
                                    <td>{rep.fechaRetiro ? rep.fechaRetiro : "Pendiente"}</td>
                                    <td>{rep.formaDePago ? rep.formaDePago : "Pendiente"}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </Form>
            <ButtonApp onClick={()=>navigate("/")}>Atras</ButtonApp>
        </div>
    )
}

export default FormReparaciones