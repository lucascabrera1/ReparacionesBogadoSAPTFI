import {useForm, useFieldArray} from 'react-hook-form'
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { AgregarUsuario, ModificarUsuario, FetchUser } from "../../Features/UsersSlice";
import {selectCurrentUser} from "../../Features/AuthSlice" 
import Input from "../../Components/Common/Input";
import ButtonApp from "../../Components/Common/Button";
import Form from 'react-bootstrap/Form'

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
    const [uam, setUam] = useState('')
    const [checkedCheckBoxisAdmin, setcheckedCheckBoxisAdmin] = useState(isAdmin)
    const {register, handleSubmit, control, formState : {errors}, getValues, reset} = useForm({
        defaultValues: { 
            nombreUsuario : "",
            email: "",
            password : "",
            rolAdmin : false,
            rolCompras: false,
            rolVentas: false,
            rolDeposito: false
        }
    })
    

    const {fields, append, remove, replace} = useFieldArray({
        control,
        name: "roles",
    })

    console.log(fields)

    const handleSubmitUser = async (data, e) => {
        const {nombreUsuario, email, password, rolAdmin, rolDeposito, rolCompras, rolVentas} = data
        let nomRoles = [];
        if (rolAdmin) nomRoles.push('admin')
        if (rolCompras) nomRoles.push('Encargado de Compras')
        if (rolDeposito) nomRoles.push('Encargado de Depósito')
        if (rolVentas) nomRoles.push('Encargado de Ventas')
        let user = {
            email: email,
            nombreUsuario: nombreUsuario,
            roles: nomRoles
        }
        if (params.id) {
          try {
            console.log(data)
            const result = await dispatch(ModificarUsuario({...user, id: params.id})).unwrap()
            console.log(result)
            alert("Usuario modificado correctamente")
            e.target.reset()
            navigate('/users')
          } catch (error) {
            console.error(error)
          }
        } else {
          try {
            console.log(data)
            user.password = password
            const result = await dispatch(AgregarUsuario(user)).unwrap()
            console.log(result)
            alert('Usuario guardado correctamente')
            e.target.reset()
            navigate('/users')
          } catch (error) {
            console.error(error)
          }
        }
    }

    useEffect ( ()=> {
        console.log("entra al use effect")
        async function fetchUser () {
            console.log('id del usuario')
            console.log(params.id)
            console.log('usuarios')
            if (params.id) {
                const userFounded = await (dispatch (FetchUser(params.id)).unwrap())
                const {nombreUsuario, email, roles} = userFounded
                let user = {
                    nombreUsuario: nombreUsuario,
                    email: email,
                    rolAdmin: roles?.find(rol=> rol.nombre === "admin")?true:false,
                    rolCompras: roles?.find(rol=> rol.nombre === "Encargado de Compras")?true:false,
                    rolVentas: roles?.find(rol=> rol.nombre === "Encargado de Ventas")?true:false,
                    rolDeposito: roles?.find(rol=> rol.nombre === "Encargado de Depósito")?true:false
                }
                console.log(userFounded)
                reset(user)
            }
        }
       fetchUser()
    }, [params.id])

    console.log(uam)

    return !isAdmin ? 
    (<div className='alert alert-danger'> 
        {userlogged.nombreUsuario } no posee el rol de Administrador
    </div>) :
    (<div className='d-flex flex-column justify-content-md-center align-items-center text-center'>
        {
            params.id ? <div key={uam._id}>
                <h3>Usuario a modificar</h3>
                <p> nombre de usuario {uam.nombreUsuario}</p>
                <p>email {uam.email}</p>
                <p>roles</p>
                <ul>{
                    uam ?  uam.roles.map(rol => {
                        return <p>{rol.nombre}</p>
                    }) : ""
                }</ul>
            </div>
            : "registe un nuevo usuario"
        }
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
                        registerOptions= {params.id ? {
                            maxLength: 50, minLength: 2 
                        } : {
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
                        registerOptions= {params.id ? {} :  {required: true} }
                        errors= {errors}
                        optionMsgErrors={{required: "El correo electrónico es obligatorio"}}
                    />
                    {params.id ? "" : <Input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        register={register}
                        registerOptions= {params.id ? {
                            maxLength: 20, minLength: 6 
                        } : {
                            required: true, maxLength: 20, minLength: 6
                        }}
                        errors= {errors}
                        optionMsgErrors={{
                            required: "La contraseña es obligatoria",
                            maxLength: "no puede incluir mas de 20 caracteres",
                            minLength: "al menos 6 caracteres"
                        }}
                    />}
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
                            id="rolAdmin"
                            name = "rolAdmin"
                            register={register}
                            errors={errors}
                            type="checkbox"
                            classname="checkbox"
                        />
                        <label class="form-check-label" for="flexCheckChecked">
                            Administrador
                        </label>
                    </div>
                    <div class="form-check">
                        <Input
                            id="rolCompras"
                            register = {register}
                            name="rolCompras"
                            errors={errors}
                            classname="checkbox" 
                            type="checkbox"
                        />
                        <label class="form-check-label" for="flexCheckChecked">
                            Encargado de Compras
                        </label>
                    </div>
                    <div class="form-check">
                        <Input
                            register={register}
                            name="rolDeposito"
                            errors = {errors}
                            classname="checkbox" 
                            type="checkbox" 
                            id="rolDeposito"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                            Encargado de Depósito
                        </label>
                    </div>
                    
                    <div class="form-check">
                        <Input
                            register={register}
                            name="rolVentas"
                            errors = {errors}
                            classname="checkbox" 
                            type="checkbox" 
                            id="rolVentas"
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
                        onClick={e => { e.preventDefault(); navigate('/users')}}>
                            Cancel
                    </ButtonApp>
                </Form.Group>
            </fieldset>
        </Form>
    </div>)
}

export default RegisterForm