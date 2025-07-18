import { FinalizarReparacion , RecuperarPresupuestoReparado, EstadoReparaciones,
    SeleccionarTodasLasReparaciones, RecuperarFormasDePago, SeleccionarTodasLasFormasDePago,
    EstadoFormasDePago } from "../Features/ReparacionesSlice";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import Input from "./Common/Input";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form"
import { useEffect, useState } from "react";

function FormFinalizarReparacion() {

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState : {errors}} = useForm({
        defaultValues : {
            fechaRetiro : new Date()
        }
    })
    console.log(params)

    const estadoreparaciones = useSelector(EstadoReparaciones)
    //const presupuesto = useSelector(SeleccionarTodasLasReparaciones)
    const [presupuesto, setPresupuesto] = useState({})
    const fps = useSelector(SeleccionarTodasLasFormasDePago)
    const estadofps = useSelector(EstadoFormasDePago)
    console.log(fps)

    useEffect(() => {
        if (estadofps === "idle") {
            dispatch(RecuperarFormasDePago())
        }
    }, [estadofps])

    console.log(presupuesto)

    useEffect(() => {
        async function RecuperarPresupuesto() {
            if (estadoreparaciones === "idle") {
                const result = await dispatch(RecuperarPresupuestoReparado(params.id)).unwrap()
                console.log(result)
                setPresupuesto(result.data)
            }
        }
        RecuperarPresupuesto()
    }, [params.id])

    const handleSubmitPresupuesto = async (data, e) => {
        console.log(data)
        try {
            const result = await dispatch(FinalizarReparacion(data)).unwrap()
            if (result.error) {
                alert(result.message)
            } else {
                alert("Reparación finalizada exitosamente")
                e.target.reset()
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const optionFormasDePago = fps.map(p => <option
        value={p._id}
        key={p._id}
      >{p.descripcion}</option>)
    
    optionFormasDePago.unshift(<option value="" key="">Seleccione</option>)

    return (
        <div>
            <h1>Presupuesto a finalizar</h1>
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
            <p>precio final : {presupuesto.precio}</p>
            <p>fecha de reparación : {presupuesto.fechaEntrega}</p>
            
            <Form onSubmit={handleSubmit(handleSubmitPresupuesto)}>
                <Input
                    type="hidden"
                    name = "id"
                    register={register}
                    errors={errors}
                    value={params.id}
                />
                <label>Forma de Pago</label>
                <Form.Select 
                    aria-label='FormaPago'
                    className='col-md-2'
                    size='sm'
                    name='formaDePago'
                    {...register('formaDePago', {required: true})}
                    onChange={(e) => {
                        e.preventDefault()
                    }}
                >
                    {optionFormasDePago}
                </Form.Select>
                {errors["formaDePago"]?.type === "required" && <>
                    <span style={{color: "red"}}>
                        Es obligatorio ingresar una forma de pago
                    </span><br/>
                </>}
                <Button variant="primary" type="submit">Finalizar Reparación</Button>
                <Button 
                    variant="secondary" 
                    onClick={()=> navigate("/finalizarreparacion")}
                >
                    Salir
                </Button>
            </Form>
        </div>
    )
}

export default FormFinalizarReparacion