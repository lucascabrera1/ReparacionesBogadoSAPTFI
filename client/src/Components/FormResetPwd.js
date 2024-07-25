import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import { sendNewPassword } from '../Features/AuthSlice'

function FormResetPwd() {
  //importacion hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  //destructuring
  console.log(params)
  const [result, setResult] = useState("")

  const ResetPassword = async () => {
    console.log("entra al reset password")
    try {
      console.log("entra al try del reset password")
      const result = await dispatch(sendNewPassword(params)).unwrap()
      console.log(result)
      setResult(result.data)
      navigate('/')
    } catch (error) {
      setResult(error.message)
      return console.error(error)
    }
  }

  useEffect(() => {
    console.log("entra al use effect")
    console.log(result)
    ResetPassword()
  }, [params.id])

  return result.error ? (
    <div>ocurrio un error</div>
  ) : (
    <div>Contraseña enviada exitosamente</div>
  )
}

export default FormResetPwd