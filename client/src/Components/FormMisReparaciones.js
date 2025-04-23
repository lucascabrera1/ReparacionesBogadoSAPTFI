//Reemplazar por recuperar reparaciones por cliente
import {RecuperarReparaciones, EstadoReparaciones, SeleccionarTodasLasReparaciones,
    ConfirmarPresupuesto, DescartarPresupuesto, ErroresReparaciones } from "../Features/ReparacionesSlice"
import { selectCurrentUser } from "../Features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import ButtonApp from "../Components/Common/Button";
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'


function FormMisReparaciones() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const estadoreparaciones = useSelector(EstadoReparaciones)
    const reparaciones = useSelector(SeleccionarTodasLasReparaciones)
    const userlogged = useSelector(selectCurrentUser)
    const erroresreparaciones = useSelector(ErroresReparaciones)

    console.log(userlogged)
    console.log(reparaciones)
    console.log(estadoreparaciones)
    console.log(erroresreparaciones)

    useEffect( () => {
        async function RecuperarReparacionesPorCliente () {
            if (estadoreparaciones === "idle") {
                const result = await dispatch(RecuperarReparaciones(userlogged._id)).unwrap()
                console.log(result)
            }
        }
        RecuperarReparacionesPorCliente()
    }, [estadoreparaciones])

    async function Confirmar (rep) {
        try {
            const presconf = await dispatch(ConfirmarPresupuesto(rep)).unwrap()
            console.log(presconf)
            alert(`presupuesto ${presconf.data.codigo} confirmado correctamente`)
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }

    async function Descartar (rep) {
        try {
            const presconf = await dispatch(DescartarPresupuesto(rep)).unwrap()
            console.log(presconf)
            alert(`presupuesto ${presconf.data.codigo} rechazado correctamente`)
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }

    return (
        erroresreparaciones ? <div className='alert alert-danger'>
            {erroresreparaciones}
        </div> : <div>
            <h1>Mis Reparaciones</h1>
            <h2>Podés confirmar o rechazar un presupuesto de reparación de tu equipo</h2>
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
                            <th>Confirmar o Descartar</th>
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
                                    {
                                        rep.estado === "Presupuestado" ? <td>
                                            <ButtonApp 
                                                variant='primary'
                                                onClick={()=> {
                                                    Confirmar(rep)
                                                    dispatch(RecuperarReparaciones(userlogged._id))
                                                }}
                                            >Confirmar
                                            </ButtonApp>
                                            <div 
                                                className="align-items-right" 
                                                //style={{ height: "100vh" }}
                                            >
                                                <ButtonApp 
                                                    variant='danger'
                                                    onClick={()=> {
                                                        Descartar(rep)
                                                        dispatch(RecuperarReparaciones(userlogged._id))
                                                    }}
                                                >Descartar
                                                </ButtonApp>
                                            </div>
                                        </td> : <td>{rep.estado} </td>
                                    }
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

export default FormMisReparaciones