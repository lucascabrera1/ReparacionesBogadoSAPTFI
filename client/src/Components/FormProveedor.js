import {useDispatch} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import {AgregarProveedor, ModificarProveedor} from '../Features/OrdenCompraSlice.js'
import Form from 'react-bootstrap/Form'

function FormProveedor() {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //const estadoproveedores = useSelector(state => state.ordenesDeCompra.proveedores)
  const {register, handleSubmit, formState : {errors}} = useForm()

  const handleSubmitProveedor = async (data, e) => {
    console.log('params')
    console.log(params)
    console.log('fin params')
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
    <div className='App d-flex flex-column justify-content-md-center align-items-center'>
      Ingrese los datos del proveedor a agregar
      <Form 
        style={{width: '450px', border: '2px solid black'}}
        onSubmit={handleSubmit(handleSubmitProveedor)}
        >
        <Form.Group className="mb-3 " controlId="dob">
          <br/>
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
            type="number"
            name="cuit"
            placeholder="Cuit"
            register={register}
            registerOptions= {{
                required: true, maxLength: 11, minLength: 8,
            }}
            errors= {errors}
            optionMsgErrors={{
                required: "la razón social es obligatoria",
                maxLength: "no puede incluir mas de 11 caracteres",
                minLength: "al menos 8 caracteres"
            }}
          />
          <br/>
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
          <br/>
          <Input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            register={register}
            registerOptions= {{required: true}}
            errors= {errors}
            optionMsgErrors={{required: "El correo electrónico es obligatorio"}}
          />
          <br/>
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
          <br/>
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
          <br/>
        </Form.Group>
        <Form.Group>
          <Button 
            className='col-lg-4' 
            style={{backgroundColor: 'green', float: 'left'}} 
            type="submit" 
            size='lg'>
              Save
          </Button>
          <Button
              className='col-lg-4'
              style={{float: 'right'}}
              variant="secondary" size = "lg"
              onClick={e => { e.preventDefault(); navigate('/proveedores')}}>
                Cancel
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default FormProveedor