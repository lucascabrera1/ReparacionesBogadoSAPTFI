import { DiagnosticarPresupuesto, RecuperarPresupuestoIngresado, EstadoReparaciones,
    SeleccionarTodasLasReparaciones} from "../Features/ReparacionesSlice";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import Input from "./Common/Input";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form"
import { useEffect } from "react";

function FormDiagnosticarPresupuesto() {

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState : {errors}} = useForm()
    console.log(params)

    const estadoreparaciones = useSelector(EstadoReparaciones)
    const reparaciones = useSelector(SeleccionarTodasLasReparaciones)

    console.log(reparaciones)

    useEffect(() => {
        if (estadoreparaciones === "idle") {
            dispatch(RecuperarPresupuestoIngresado(params.id))
        }
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
            {
                reparaciones.map(rep => {
                    return <div key={rep._id}>
                        <p>codigo: {rep.codigo}</p>
                        <p>cliente: {rep.cliente}</p>
                        <p>estado: {rep.estado}</p>
                        <p>falla que presenta : {rep.falla}</p>
                        <p>fecha de ingreso: {rep.fechaIngreso}</p>
                        <p>marca: {rep.marca}</p>
                        <p>modelo: {rep.modelo}</p>
                    </div>
                })
            }
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