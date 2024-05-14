import { useState } from "react";
import {useForm, useFieldArray} from 'react-hook-form'
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../Components/Common/Input";
import Button from "../../Components/Common/Button";
import { AgregarUsuario, ModificarUsuario } from "../../Features/AuthSlice";
import {selectCurrentUser} from "../../Features/AuthSlice" 
import ButtonApp from "../../Components/Common/Button";
import Form from 'react-bootstrap/Form'
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";

function RegisterForm() {

    const userlogged = useSelector(selectCurrentUser)
    let isAdmin = false
    userlogged.roles.forEach(rol => {
        console.log(rol)
        if (rol.nombre === "admin") isAdmin = true
    })
    console.log(isAdmin)
    const params = useParams()
    console.log(params)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, control, formState : {errors}} = useForm()

    const {fields, append, remove, replace} = useFieldArray({
        control,
        name: "roles",
    })

    console.log(fields)

    const handleSubmitUser = async (data, e) => {
        if (params.id) {
          try {
            console.log(data)
            const result = await dispatch(ModificarUsuario({...data, id: params.id})).unwrap()
            console.log(result.data)
            alert("Usuario modificado correctamente")
            e.target.reset()
            navigate('/')
          } catch (error) {
            console.error(error)
          }
        } else {
          try {
            console.log(data)
            const result = await dispatch(AgregarUsuario(data)).unwrap()
            console.log(result)
            alert('Usuario guardado correctamente')
            e.target.reset()
            navigate('/')
          } catch (error) {
            console.error(error)
          }
        }
    }

    return !isAdmin ? 
    (<div className='alert alert-danger'> 
        {userlogged.nombreUsuario } no posee el rol de Administrador
    </div>) :
    (<div className='d-flex flex-column justify-content-md-center align-items-center text-center'>
        <Form id="formUsuario"
            style={{width: '450px'}}
            onSubmit={handleSubmit(handleSubmitUser)}
        >
            <fieldset>
                <legend>Datos del Usuario</legend>
                <Form.Group className="mb-3 " controlId="dob">
                    <Input
                        type="text"
                        name="nombreUsuario"
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
                <Form.Group className="mb-3 " controlId="dob">
                    <legend>Roles del nuevo usuario</legend>
                    {/* <div className="form-check">
                        <Input
                            register = {register}
                            name="roles"
                            errors = {errors}
                            classname="checkbox" 
                            type="checkbox"
                            value="admin" 
                            id="flexCheckDefault"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                            Administrador
                        </label>
                    </div> */}
                    <div class="form-check">
                        <Input
                            id="admin"
                            name = {`roles.${fields[0]}`}
                            register={register}
                            errors={errors}
                            type="checkbox"
                            classname="checkbox"
                            onClick={ e => {
                                console.log("onclick")
                                e.target.checked 
                                ? append("admin")
                                : remove("admin")
                                console.log(fields)
                            }}
                        />
                        <label class="form-check-label" for="flexCheckChecked">
                            Administrador
                        </label>
                    </div>
                    <div class="form-check">
                        <Input
                            register = {register}
                            name={`roles.${fields[1]}`}
                            errors={errors}
                            classname="checkbox" 
                            type="checkbox" 
                            value="Encargado de Compras" 
                            id="flexCheckChecked"
                            onClick= {(e => {
                                console.log("click en encargado de compras")
                                e.target.checked 
                                ? append("Encargado de Compras")
                                : remove("Encargado de Compras")
                            })}
                        />
                        <label class="form-check-label" for="flexCheckChecked">
                            Encargado de Compras
                        </label>
                    </div>
                    <div class="form-check">
                        <Input
                            register={register}
                            name={`roles.${fields[2]}`}
                            errors = {errors}
                            classname="checkbox" 
                            type="checkbox" 
                            value="Encargado de Depósito" 
                            id="flexCheckDefault"
                            onClick= {(e => {
                                console.log("click en encargado de depósito")
                                e.target.checked 
                                ? append("Encargado de Depósito")
                                : remove("Encargado de Depósito")
                            })}
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                            Encargado de Depósito
                        </label>
                    </div>
                    
                    <div class="form-check">
                        <Input
                            register={register}
                            name={`roles.${fields[3]}`}
                            errors = {errors}
                            classname="checkbox" 
                            type="checkbox" 
                            value="Encargado de Ventas" 
                            id="flexCheckDefault"
                            onClick= {(e => {
                                console.log("click en encargado de ventas")
                                e.target.checked 
                                ? append("Encargado de Ventas")
                                : remove("Encargado de Ventas")
                            })}
                        />
                        <label class="form-check-label" for="flexCheckChecked">
                            Encargado de Ventas
                        </label>
                    </div>
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
                        onClick={e => { e.preventDefault(); navigate('/')}}>
                            Cancel
                    </ButtonApp>
                </Form.Group>
            </fieldset>
        </Form>
    </div>)
}

export default RegisterForm