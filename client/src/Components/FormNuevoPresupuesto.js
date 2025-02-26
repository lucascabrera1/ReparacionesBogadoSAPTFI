import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import {AgregarPresupuesto} from "../Features/ReparacionesSlice"
import ButtonApp from "../Components/Common/Button";
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Input from '../Components/Common/Input'

function FormNuevoPresupuesto() {

    const {register, handleSubmit, formState : {errors}} = useForm({
        defaultValues : {
            fechaIngreso : new Date()
        }
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmitPresupuesto = async (data, e) => {
        try {
            const result = await dispatch(AgregarPresupuesto(data)).unwrap()
            console.log(result)
            if (result.error) {
                alert(result.message)
            } else {
                alert('presupuesto guardado correctamente')
                e.target.reset()
                navigate(`/nuevopresupuesto`)
            }
        } catch (error) {
            console.error(error)
        }
    } 

    return (
        <div>
            <Form onSubmit={handleSubmit(handleSubmitPresupuesto)}>
                <p>Ingrese un nuevo Presupuesto de Reparación</p>
                <Input
                    type="number"
                    name="codigo"
                    placeholder="Código"
                    register={register}
                    registerOptions= {{required: true, minLength: 1, maxLength: 4, min: 0}}
                    optionMsgErrors={{
                      required: "El codigo es obligatorio",
                      minLength : "Minimo 1 digito",
                      maxLength : "Máximo 4 dígitos",
                      min: "El valor debe ser mayor o igual a 0"
                    }}
                    errors={errors}
                />
                <label>Cliente</label>
                <Form.Select
                    aria-label='Cliente'
                    className='col-md-2'
                    size='sm'
                    name='cliente'
                    {...register('cliente')}
                >
                    Option CLientes
                </Form.Select>
                <Input
                    type="textarea"
                    name="falla"
                    label="Falla"
                    register={register}
                    registerOptions= {{
                        required: true, maxLength: 300, minLength: 2 
                    }}
                    errors= {errors}
                    optionMsgErrors={{
                        required: "la falla es obligatoria",
                        maxLength: "no puede incluir mas de 300 caracteres",
                        minLength: "al menos 2 caracteres"
                    }}
                />
                <label>Marca</label>
                <Form.Select
                    aria-label='Marca'
                    className='col-md-2'
                    size='sm'
                    name='marca'
                    {...register('marca')}
                >
                    Option Marcas
                </Form.Select>
                <label>Modelo</label>
                <Form.Select
                    aria-label='Modelo'
                    className='col-md-2'
                    size='sm'
                    name='modelo'
                    {...register('modelo')}
                >
                    Option Modelos
                </Form.Select>
                <Input
                    type="hidden"
                    name="fechaIngreso"
                    register={register}
                    errors={errors}
                />
            </Form>
        </div>
    )
}

export default FormNuevoPresupuesto