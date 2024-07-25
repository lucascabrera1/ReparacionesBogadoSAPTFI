import React from 'react'
import {useState } from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { sendLinkForResetPassword } from '../Features/AuthSlice'
import {useForm} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import Form from 'react-bootstrap/Form'

function FormLinkResetPwd() {
    //importacion hooks
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit, formState : {errors}} = useForm()
    //hook usestate
    const [errMsg, setErrMsg] = useState("inicio")

    const generarLink = async (user) => {
        try {
            const link = await dispatch(sendLinkForResetPassword(user)).unwrap()
            console.log(link)
            if (link) {
                setErrMsg("")
                alert("chequeé su email para iniciar el reseteo de la clave")
                navigate("/login")
            } else {
                setErrMsg("Email inexistente")
                alert("El usuario no existe")
            }
        } catch (error) {
            return console.error(error)
        }
    }
   return (
    <Form onSubmit={handleSubmit(generarLink)}>
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
        <Button type="submit">Recuperar contraseña</Button>
        { 
            errMsg === "Email inexistente" ?  
                <p style={{backgroundColor: 'GrayText', color: 'red'}}>error {errMsg}</p> 
            : ""
        }
    </Form>
  )
}

export default FormLinkResetPwd