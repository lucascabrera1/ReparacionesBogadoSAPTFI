import { IngresarReparacion, RecuperarPresupuestoConfirmado, EstadoReparaciones,
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
    const {register, handleSubmit, formState : {errors}} = useForm({
        defaultValues : {
            fechaEntrega : new Date()
        }
    })
    const [presupuesto, setPresupuesto] = useState({})
    console.log(params)

    const estadoreparaciones = useSelector(EstadoReparaciones)
    //const presupuesto = useSelector(SeleccionarTodasLasReparaciones)

    console.log(presupuesto)

    useEffect(() => {
        async function RecuperarPresupuesto() {
            if (estadoreparaciones === "idle") {
                const result = await dispatch(RecuperarPresupuestoConfirmado(params.id)).unwrap()
                console.log(result)
                setPresupuesto(result.data);
            }
        }
        RecuperarPresupuesto()
    }, [params.id])

    const handleSubmitPresupuesto = async (data, e) => {
        console.log(data)
        try {
            const result = await dispatch(IngresarReparacion(data)).unwrap()
            if (result.error) {
                alert(result.message)
            } else {
                alert("Reparación ingresada exitosamente")
                e.target.reset()
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1>Nueva Reparación</h1>
            <p>codigo: {presupuesto.codigo}</p>
            <p>cliente: {presupuesto.cliente}</p>
            <p>estado: {presupuesto.estado}</p>
            <p>falla que presenta : {presupuesto.falla}</p>
            <p>fecha de ingreso: {presupuesto.fechaIngreso}</p>
            <p>marca: {presupuesto.marca}</p>
            <p>modelo: {presupuesto.modelo}</p>
            <p>fecha aproximada de entrega: {presupuesto.fechaAproxEntrega}</p>
            <p>diagnóstico: {presupuesto.diagnostico}</p>
            <p>precio aproximado: {presupuesto.precioAproximado}</p>
            
            <Form onSubmit={handleSubmit(handleSubmitPresupuesto)}>
                <Input
                    type="float"
                    name="precio"
                    placeholder="Precio final"
                    register={register}
                    registerOptions= {{required: true}}
                    errors= {errors}
                    optionMsgErrors={{required: "el precio final es obligatorio"}}
                />
                <Input
                    type="hidden"
                    name = "id"
                    register={register}
                    errors={errors}
                    value={params.id}
                />
                <Button variant="primary" type="submit">Ingresar Reparación</Button>
                <Button 
                    variant="secondary" 
                    onClick={()=> navigate("/presupuestosconfirmados")}
                >
                    Salir
                </Button>
            </Form>
        </div>
    )
}

export default FormDiagnosticarPresupuesto