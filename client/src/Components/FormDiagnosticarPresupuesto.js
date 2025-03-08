import { DiagnosticarPresupuesto, RecuperarPresupuestoIngresado, EstadoReparaciones,
    SeleccionarTodasLasReparaciones} from "../Features/ReparacionesSlice";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import Input from "./Common/Input";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form"
import { useEffect, useState } from "react";

function FormDiagnosticarPresupuesto() {

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState : {errors}} = useForm()
    console.log(params)

    const estadoreparaciones = useSelector(EstadoReparaciones)
    const presupuesto = useSelector(SeleccionarTodasLasReparaciones)

    console.log(presupuesto)

    useEffect(() => {
        async function RecuperarPresupuesto() {
            if (estadoreparaciones === "idle") {
                const result = await dispatch(RecuperarPresupuestoIngresado(params.id)).unwrap()
                console.log(result)
            }
        }
        RecuperarPresupuesto()
    }, [params.id])

    const handleSubmitPresupuesto = async (data, e) => {
        try {
            const result = await dispatch(DiagnosticarPresupuesto(data)).unwrap()
            if (result.error) {
                alert(result.message)
            } else {
                alert("presupuesto diagnosticado exitosamente")
                e.target.reset()
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1>Presupuesto a diagnosticar</h1>
            <p>codigo: {presupuesto.codigo}</p>
            <p>cliente: {presupuesto.cliente}</p>
            <p>estado: {presupuesto.estado}</p>
            <p>falla que presenta : {presupuesto.falla}</p>
            <p>fecha de ingreso: {presupuesto.fechaIngreso}</p>
            <p>marca: {presupuesto.marca}</p>
            <p>modelo: {presupuesto.modelo}</p>
            
            <Form onSubmit={handleSubmit(handleSubmitPresupuesto)}>
                <Input
                    type="text"
                    name="diagnostico"
                    placeholder="Diagnóstico del equipo"
                    register={register}
                    registerOptions= {{
                        required: true, maxLength: 200, minLength: 3,
                    }}
                    errors= {errors}
                    optionMsgErrors={{
                        required: "El diagnóstico es obligatorio",
                        maxLength: "no puede incluir mas de 200 caracteres",
                        minLength: "al menos 3 caracteres"
                    }}
                />
                <Input
                    type="float"
                    name="precioAproximado"
                    placeholder="Precio aproximado de la reparación"
                    register={register}
                    registerOptions= {{required: true}}
                    errors= {errors}
                    optionMsgErrors={{required: "el precio aproximado es obligatorio"}}
                />
                <Input
                    type="date"
                    register={register}
                    name="fechaAproxEntrega"
                    registerOptions={{
                    required: true,
                    validate: (value, formValues) => {
                        let fechaEntrega = new Date(value)
                        let fechaactual = new Date()
                        if (fechaEntrega<fechaactual) {
                            return false
                        } else return true
                    }}}
                    optionMsgErrors={{
                    required : "La fecha aproximada de entrega es obligatoria",
                    validate: "La fecha aproximada de entrega debe ser posterior a hoy"
                    }}
                    errors={errors}
                    label="fecha aproximada de entrega"
                />
                <Input
                    type="hidden"
                    name = "id"
                    register={register}
                    errors={errors}
                    value={params.id}
                />
                <Button variant="primary" type="submit">Confirmar Diagnóstico</Button>
                <Button 
                    variant="secondary" 
                    onClick={()=> navigate("/presupuestosingresados")}
                >
                    Salir
                </Button>
            </Form>
        </div>
    )
}

export default FormDiagnosticarPresupuesto