import { useState } from "react";
import {useForm} from 'react-hook-form'
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import Input from "../../Components/Common/Input";
import Button from "../../Components/Common/Button";
//import styles from '../../Components/style.module.css'
import { login } from "../../Features/AuthSlice";

const Login = () =>{

    const {register, handleSubmit, formState : {errors}} = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errMsg, setErrMsg] = useState('')

    const SubmitUser = async (user) => {
        try {
            const userData = await dispatch(login(user)).unwrap()
            if (userData) {
                navigate("/")
            } else {
                setErrMsg("Credenciales inválidas")
                alert ("usuario y/o contraseña incorrectos")
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    return (
        <form onSubmit={handleSubmit(SubmitUser)}>
            <p className="error">{errMsg}</p>
            <Input
                type='email'
                name='email' 
                label='Correo Electrónico'
                register={register}
                registerOptions= {{
                    required: true
                }}
                errors= {errors}
                optionMsgErrors={{
                    required: "el correo electrónico es obligatorio"
                }}
            />
            <Input
                type='password'
                name='password'
                label='contraseña'
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
            <Button 
                type="submit"
            >
            Iniciar Sesión </Button>
        </form>
    )
}

export default Login;