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
  const [result, setResult] = useState({error:false})

  

  useEffect(()=> {
    async function ResetPassword () {
      console.log("entra al useffect reset password")
      try {
        console.log("entra al try del reset password")
        const resultcall = await dispatch(sendNewPassword(params)).unwrap()
        console.log(resultcall)
        setResult(resultcall)
        if (!resultcall) {
          console.log("entraaaa")
          setResult({error:true})
        }
        
      } catch (error) {
        setResult(error)
        console.error(error)
      }
    }
    console.log("entra al use effect")
    console.log(result)
    ResetPassword()
  }, [])

  return <>
    {result.error ? (
      <div>el link expiró o ya fue utilizado</div>
    ) : (
      <div>Contraseña enviada exitosamente</div>
    )}
  </>
}

export default FormResetPwd