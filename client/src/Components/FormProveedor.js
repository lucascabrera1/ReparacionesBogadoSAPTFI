import {useDispatch} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import ButtonApp from './Common/Button.js'
import Input from './Common/Input'
import {AgregarProveedor, ModificarProveedor} from '../Features/OrdenCompraSlice.js'
import Form from 'react-bootstrap/Form'

function FormProveedor() {

  const params = useParams()
  console.log(params)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //const estadoproveedores = useSelector(state => state.ordenesDeCompra.proveedores)
  const {register, handleSubmit, formState : {errors}} = useForm()

  const handleSubmitProveedor = async (data, e) => {
    if (params.id) {
      try {
        console.log(data)
        const result = await dispatch(ModificarProveedor({...data, id: params.id})).unwrap()
        console.log(result.data)
        alert("Proveedor modificado correctamente")
        e.target.reset()
        navigate('/proveedores')
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const result = await dispatch(AgregarProveedor(data)).unwrap()
        console.log(result)
        alert('proveedor guardado correctamente')
        e.target.reset()
        navigate('/proveedores')
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className='d-flex flex-column justify-content-md-center align-items-center text-center'>
      <Form id="formProveedor"
        style={{width: '450px'}}
        onSubmit={handleSubmit(handleSubmitProveedor)}
        >
            <fieldset>
            <legend>Datos del proveedor</legend>
        <Form.Group className="mb-3 " controlId="dob">
          <Input
            type="text"
            name="razonsocial"
            placeholder="Razón Social"
            register={register}
            registerOptions= {{
                required: true, maxLength: 50, minLength: 2 
            }}
            errors= {errors}
            optionMsgErrors={{
                required: "la razón social es obligatoria",
                maxLength: "no puede incluir mas de 50 caracteres",
                minLength: "al menos 2 caracteres"
            }}
          />
          <br/>
          <Input
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
          />
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
              onClick={e => { e.preventDefault(); navigate('/proveedores')}}>
                Cancelar
          </ButtonApp>
        </Form.Group>
        </fieldset>
      </Form>
      
    </div>
  )
}

export default FormProveedor