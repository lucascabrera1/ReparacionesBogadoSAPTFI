import {useDispatch} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import ButtonApp from './Common/Button.js'
import Input from './Common/Input'
import {AgregarCliente, ModificarCliente, RecuperarCliente} from '../Features/VentaSlice.js'
import Form from 'react-bootstrap/Form'
import "../App.css"
import { useEffect, useState } from 'react'

function FormCliente() {
    const params = useParams()
    console.log(params)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState : {errors}, reset} = useForm()

    const handleSubmitCliente = async (data, e) => {
        if (params.id) {
            try {
                console.log(data)
                const result = await dispatch(ModificarCliente({...data, id: params.id})).unwrap()
                if (result.error) {
                    alert(result.message)
                    navigate(`/clientes/${params.id}`)
                    const cliente = await dispatch(RecuperarCliente(params.id)).unwrap()
                    console.log(cliente)
                    reset(cliente)
                } else {
                    alert("Cliente modificado correctamente")
                    navigate('/clientes')
                }
                console.log(result)
                e.target.reset()
                
            } catch (error) {
                alert(error)
                console.error(error)
            }
        } else {
            try {
                const result = await dispatch(AgregarCliente(data)).unwrap()
                console.log(result)
                alert('Cliente guardado correctamente')
                e.target.reset()
                navigate('/clientes')
            } catch (error) {
                console.error(error)
            }
        }
    }

    useEffect(()=> {
        async function buscarCliente() {
            if (params.id) {
                const clienteencontrado = await (dispatch (RecuperarCliente(params.id)).unwrap())
                console.log(clienteencontrado)
                reset(clienteencontrado)
            }
        }
        buscarCliente()
    }, [params.id])

    return (
    <div className='d-flex flex-column justify-content-md-center align-items-center text-center'>
        <Form id="formCliente"
            style={{width: '450px'}}
            onSubmit={handleSubmit(handleSubmitCliente)}
        >
        <fieldset>
            <legend>Datos del cliente</legend>
            <Form.Group className="mb-3 " controlId="dob">
            <Input
                type="text"
                name="nombreyapellido"
                placeholder="Nombre y Apellido"
                register={register}
                registerOptions= {{
                    required: true, maxLength: 50, minLength: 2 
                }}
                errors= {errors}
                optionMsgErrors={{
                    required: "el nombre y apellido son obligatorios",
                    maxLength: "no puede incluir mas de 50 caracteres",
                    minLength: "al menos 2 caracteres"
                }}
            />
            <Input
                //className="input-common"
                className='input-uniform'
                type="number"
                name="dni"
                placeholder="DNI"
                register={register}
                registerOptions= {{
                    required: true, maxLength: 8, minLength: 7 
                }}
                errors= {errors}
                optionMsgErrors={{
                    required: "el documento es obligatorio",
                    maxLength: "no puede incluir mas de 8 caracteres",
                    minLength: "al menos 7 caracteres"
                }}
            />
            {/* <Input
                classname='w-50'
                type="number"
                name="cuit"
                placeholder="Cuit"
                register={register}
                registerOptions= {{
                    required: true, maxLength: 11, minLength: 8,
                }}
                errors= {errors}
                optionMsgErrors={{
                    required: "el cuit es obligatorio",
                    maxLength: "no puede incluir mas de 11 caracteres",
                    minLength: "al menos 8 caracteres"
                }}
            /> */}
            <Input
                type="text"
                name="direccion"
                placeholder="Dirección"
                register={register}
                registerOptions= {{
                    required: true, maxLength: 50, minLength: 2 
                }}
                errors= {errors}
                optionMsgErrors={{
                    required: "la dirección es obligatoria",
                    maxLength: "no puede incluir mas de 50 caracteres",
                    minLength: "al menos 2 caracteres"
                }}
            />
            <Input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                register={register}
                registerOptions= {{required: true}}
                errors= {errors}
                optionMsgErrors={{required: "El correo electrónico es obligatorio"}}
            />
            <Input
                type="text"
                name="localidad"
                placeholder="Localidad"
                register={register}
                registerOptions= {{
                    required: true, maxLength: 60, minLength: 2 
                }}
                errors= {errors}
                optionMsgErrors={{
                    required: "la localidad es obligatoria",
                    maxLength: "no puede incluir mas de 60 caracteres",
                    minLength: "al menos 2 caracteres"
                }}
            />
            <Input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                register={register}
                registerOptions= {{
                    required: true, maxLength: 20, minLength: 8 
                }}
                errors= {errors}
                optionMsgErrors={{
                    required: "el teléfono es obligatorio",
                    maxLength: "no puede incluir mas de 20 caracteres",
                    minLength: "al menos 8 caracteres"
                }}
            />
            </Form.Group>
            <Form.Group>
            <ButtonApp 
                className='col-lg-4' 
                variant='success'
                type="submit" 
            >
                Guardar
            </ButtonApp>
            <ButtonApp
                className='col-lg-4'
                style={{float: 'right'}}
                variant="secondary"
                onClick={e => { e.preventDefault(); navigate('/clientes')}}>
                    Cancelar
            </ButtonApp>
            </Form.Group>
        </fieldset>
      </Form>
    </div>
    )
}

export default FormCliente