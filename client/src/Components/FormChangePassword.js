import {useForm} from 'react-hook-form'
import { useNavigate, useParams } from "react-router";
import { useDispatch} from "react-redux";
import { changePassword} from "../Features/AuthSlice";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form"
import Input from "../Components/Common/Input";
import Button from "../Components/Common/Button";

function FormChangePassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const {register, handleSubmit, formState : {errors}} = useForm()

    const changePasswordSubmit = async (data, e) => {
        
        try {
            const result = await dispatch(changePassword({...data, id: params.id})).unwrap()
            console.log(result)
            console.log(params)
            console.log(data)
            if (result.error) {
                alert(result.message)
            } else {
                alert("contraseña cambiada exitosamente")
                navigate("/")
            }
            
            /*if (result === true) {
                alert("contraseña cambiada exitosamente")
                e.target.reset()
                navigate("/")
            } else {
                console.log("se va por el else")
                console.log(result)
                alert(result)
            }*/
            
        } catch (error) {
            console.log("ocurrio un error")
            console.error(error)
            alert(error)
        }
    }
  return (
    <Form onSubmit={handleSubmit(changePasswordSubmit)}>
        <Input
            type='password'
            name='op'
            label='antigua contraseña'
            register={register}
            registerOptions= {{
                required: true, minLength: 6
            }}
            errors= {errors}
            optionMsgErrors={{
                required: "la contraseña es requerida",
                minLength: "minimo 6 caracteres",
            }}
        />
        <Input
            type='password'
            name='np'
            label='nueva contraseña'
            register={register}
            registerOptions= {{
                required: true, minLength: 6
            }}
            errors= {errors}
            optionMsgErrors={{
                required: "la contraseña es requerida",
                minLength: "minimo 6 caracteres",
            }}
        />
        <Input
            type='password'
            name='cnp'
            label='confirmar nueva contraseña'
            register={register}
            registerOptions= {{
                required: true, minLength: 6
            }}
            errors= {errors}
            optionMsgErrors={{
                required: "la contraseña es requerida",
                minLength: "minimo 6 caracteres",
            }}
        />
        <Button type="submit" >Cambiar Contraseña</Button>
        <NavLink to='/'>Cancelar</NavLink>
    </Form>
  )
}

export default FormChangePassword