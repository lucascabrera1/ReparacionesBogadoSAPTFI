import { RecuperarPresupuestosReparados, EstadoReparaciones, SeleccionarTodasLasReparaciones
} from "../Features/ReparacionesSlice";
import { useDispatch, useSelector } from 'react-redux'

import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import Table from "react-bootstrap/esm/Table";
import { useEffect } from "react";
import { selectCurrentUser } from "../Features/AuthSlice";

function FormPresupuestosReparados() {

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const estadoreparaciones = useSelector(EstadoReparaciones)
   const presupuestosreparados = useSelector(SeleccionarTodasLasReparaciones)

   console.log(presupuestosreparados)

   useEffect(() => {
       if (estadoreparaciones === "idle") {
           dispatch(RecuperarPresupuestosReparados())
       }
   }, [estadoreparaciones])

   const userlogged = useSelector(selectCurrentUser)
   let iser = false
   userlogged.roles.map(rol => {
       if (rol.nombre === "Encargado de Reparaciones") iser = true
       return iser
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
                       <th>Diagnóstico</th>
                       <th>Precio Aproximado</th>
                       <th>Fecha Aproximada de Entrega</th>
                       <th>Precio Final</th>
                       <th>Fecha de Reparación</th>
                       <th>Finalizar Reparación</th>
                   </tr>
               </thead>
               <tbody>
                   { Array.isArray(presupuestosreparados) ? 
                       presupuestosreparados.map(pres => {
                           return <tr key={pres._id}>
                               <td>{pres.codigo}</td>
                               <td>{pres.cliente}</td>
                               <td>{pres.estado}</td>
                               <td>{pres.falla}</td>
                               <td>{pres.fechaIngreso}</td>
                               <td>{pres.marca}</td>
                               <td>{pres.modelo}</td>
                               <td>{pres.diagnostico}</td>
                               <td>{pres.precioAproximado}</td>
                               <td>{pres.fechaAproxEntrega}</td>
                               <td>{pres.precio}</td>
                               <td>{pres.fechaEntrega}</td>
                               <td><Button onClick={()=> navigate(`/finalizarreparacion/${pres._id}`)}>Finalizar Reparación</Button></td>
                           </tr>
                       }) :  <tr key={presupuestosreparados._id}>
                            <td>{presupuestosreparados.codigo}</td>
                            <td>{presupuestosreparados.cliente}</td>
                            <td>{presupuestosreparados.estado}</td>
                            <td>{presupuestosreparados.falla}</td>
                            <td>{presupuestosreparados.fechaIngreso}</td>
                            <td>{presupuestosreparados.marca}</td>
                            <td>{presupuestosreparados.modelo}</td>
                            <td>{presupuestosreparados.diagnostico}</td>
                            <td>{presupuestosreparados.precioAproximado}</td>
                            <td>{presupuestosreparados.fechaAproxEntrega}</td>
                            <td>{presupuestosreparados.precio}</td>
                            <td>{presupuestosreparados.fechaEntrega}</td>
                            <td><Button onClick={()=> navigate(`/finalizarreparacion/${presupuestosreparados._id}`)}>Finalizar Reparación</Button></td>
                        </tr>
                    }
               </tbody>
           </Table>
           <Button 
               variant="secondary" 
               onClick={(e)=> {
                   e.preventDefault()
                   dispatch(RecuperarPresupuestosReparados())
                   navigate("/")
               }}
           >
                Atrás
           </Button>
       </div> : <div className='alert alert-danger'>
           {userlogged.nombreUsuario} no tiene el rol de encargado de reparaciones
       </div>
   )
}

export default FormPresupuestosReparados