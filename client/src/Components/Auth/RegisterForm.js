import { useState } from "react";
import {useForm} from 'react-hook-form'
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import Input from "../../Components/Common/Input";
import Button from "../../Components/Common/Button";
import { AgregarUsuario, ModificarUsuario } from "../../Features/AuthSlice";
import ButtonApp from "../../Components/Common/Button";
import Form from 'react-bootstrap/Form'

function RegisterForm() {

    const params = useParams
    console.log(params)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState : {errors}} = useForm()

    const handleSubmitUser = async (data, e) => {
        if (params.id) {
          try {
            console.log(data)
            const result = await dispatch(ModificarUsuario({...data, id: params.id})).unwrap()
            console.log(result.data)
            alert("Usuario modificado correctamente")
            e.target.reset()
            navigate('/seguridad')
          } catch (error) {
            console.error(error)
          }
        } else {
          try {
            const result = await dispatch(AgregarUsuario(data)).unwrap()
            console.log(result)
            alert('Usuario guardado correctamente')
            e.target.reset()
            navigate('/seguridad')
          } catch (error) {
            console.error(error)
          }
        }
      }

    return (<div className='d-flex flex-column justify-content-md-center align-items-center text-center'>
        <Form id="formUsuario"
            style={{width: '450px'}}
            onSubmit={handleSubmit(handleSubmitUser)}
        >
            <fieldset>
                <legend>Datos del Usuario</legend>
                <Form.Group className="mb-3 " controlId="dob">
                    <Input
                        type="text"
                        name="nombreusuario"
                        placeholder="Nombre de Usuario"
                        register={register}
                        registerOptions= {{
                            required: true, maxLength: 50, minLength: 2 
                        }}
                        errors= {errors}
                        optionMsgErrors={{
                            required: "El nombre de usuario es obligatorio",
                            maxLength: "No puede incluir mas de 50 caracteres",
                            minLength: "Al menos 2 caracteres"
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
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        register={register}
                        registerOptions= {{
                            required: true, maxLength: 20, minLength: 6 
                        }}
                        errors= {errors}
                        optionMsgErrors={{
                            required: "La contraseña es obligatoria",
                            maxLength: "no puede incluir mas de 20 caracteres",
                            minLength: "al menos 6 caracteres"
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <ButtonApp 
                        className='col-lg-4' 
                        variant='success'
                        type="submit" 
                        >
                        Save
                    </ButtonApp>
                    <ButtonApp
                        className='col-lg-4'
                        style={{float: 'right'}}
                        variant="secondary"
                        onClick={e => { e.preventDefault(); navigate('/seguridad')}}>
                            Cancel
                    </ButtonApp>
                </Form.Group>
            </fieldset>
        </Form>
    </div>)
}

export default RegisterForm