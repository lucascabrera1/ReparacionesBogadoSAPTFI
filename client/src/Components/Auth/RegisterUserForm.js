import { AgregarUsuario } from "../../Features/ReparacionesSlice"
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Input from "../../Components/Common/Input";
import ButtonApp from "../../Components/Common/Button";
import Form from 'react-bootstrap/Form'
import { selectCurrentUser } from "../../Features/AuthSlice";


function RegisterUserForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userlogged = useSelector(selectCurrentUser)

    const {handleSubmit, register, formState: {errors}, reset} = useForm({
        defaultValues: {
            nombreUsuario : "",
            email : "",
            password : "",
            confirmPassword : ""
        }
    })

    const handleSubmitUser = async (data, e) => {
        const {nombreUsuario, email, password, confirmPassword} = data
        let nomRoles = [];
        nomRoles.push('user')
        let user = {
            email: email,
            nombreUsuario: nombreUsuario,
            password : password,
            roles: nomRoles
        }
        
        try {
            console.log(data)
            console.log(password, confirmPassword)
            if (password !== data.onfirmPassword) {
                alert("las claves no coinciden")
                reset(user)
            } else {
                const result = await dispatch(AgregarUsuario(user)).unwrap()
                console.log(result)
                if (result.error) {
                    alert(result.message)
                    reset(user)
                } else {
                    alert('Usuario guardado correctamente')
                    e.target.reset()
                }
                navigate('/users')
            }
            
        } catch (error) {
            reset(user)
            console.error(error)
        }
        
    }

    return userlogged ? <div className="alert alert-danger">Cierre sesión para registrarse</div> : (
        <div className='d-flex flex-column justify-content-md-center align-items-center text-center'>
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
                                required: true, maxLength : 50, minLength: 2
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
                            registerOptions= { {
                                required: true, maxLength: 20, minLength: 6
                            }}
                            errors= {errors}
                            optionMsgErrors={{
                                required: "La contraseña es obligatoria",
                                maxLength: "no puede incluir mas de 20 caracteres",
                                minLength: "al menos 6 caracteres"
                            }}
                        />
                        <Input
                            type="password"
                            name="confirmpassword"
                            placeholder="Confirmar Contraseña"
                            register={register}
                            registerOptions= { {
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
                            onClick={e => { e.preventDefault(); navigate('/users')}}>
                                Cancel
                        </ButtonApp>
                    </Form.Group>
                </fieldset>
            </Form>
        </div>
    )
}

export default RegisterUserForm