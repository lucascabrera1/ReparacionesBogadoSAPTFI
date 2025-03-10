//la idea es, en este formulario, ver los presupuestos ingresados para diagnosticarlos
import { RecuperarPresupuestosConfirmados, EstadoReparaciones, SeleccionarTodasLasReparaciones
} from "../Features/ReparacionesSlice";
import { useDispatch, useSelector } from 'react-redux'

import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import Table from "react-bootstrap/esm/Table";
import { useEffect } from "react";
import { selectCurrentUser } from "../Features/AuthSlice";

function FormPresupuestosConfirmados() {

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const estadoreparaciones = useSelector(EstadoReparaciones)
   const presupuestosconfirmados = useSelector(SeleccionarTodasLasReparaciones)

   console.log(presupuestosconfirmados)

   useEffect(() => {
       if (estadoreparaciones === "idle") {
           dispatch(RecuperarPresupuestosConfirmados())
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
                       <th>Ingresar Reparación</th>
                   </tr>
               </thead>
               <tbody>
                   { Array.isArray(presupuestosconfirmados) ? 
                       presupuestosconfirmados.map(pres => {
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
                               <td><Button onClick={()=> navigate(`/diagnosticar/${pres._id}`)}>Ingresar Reparación</Button></td>
                           </tr>
                       }) :  <tr key={presupuestosconfirmados._id}>
                            <td>{presupuestosconfirmados.codigo}</td>
                            <td>{presupuestosconfirmados.cliente}</td>
                            <td>{presupuestosconfirmados.estado}</td>
                            <td>{presupuestosconfirmados.falla}</td>
                            <td>{presupuestosconfirmados.fechaIngreso}</td>
                            <td>{presupuestosconfirmados.marca}</td>
                            <td>{presupuestosconfirmados.modelo}</td>
                            <td>{presupuestosconfirmados.diagnostico}</td>
                            <td>{presupuestosconfirmados.precioAproximado}</td>
                            <td>{presupuestosconfirmados.fechaAproxEntrega}</td>
                            <td><Button onClick={()=> navigate(`/diagnosticar/${presupuestosconfirmados._id}`)}>Ingresar Reparación</Button></td>
                        </tr>
                    }
               </tbody>
           </Table>
           <Button 
               variant="secondary" 
               onClick={(e)=> {
                   e.preventDefault()
                   dispatch(RecuperarPresupuestosConfirmados())
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

export default FormPresupuestosConfirmados