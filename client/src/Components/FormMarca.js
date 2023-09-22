import { useDispatch, useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import {AgregarMarca} from '../Features/OrdenCompraSlice.js'

function FormMarca () {
    const {register, handleSubmit, formState : {errors}} = useForm()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const marcas = useSelector(state => state.ordenesDeCompra.marcas);

    console.log(marcas)

    const handleSubmitMarca = async (data, e) => {
        console.log('se llama al handle submit marca')
        console.log(data)
        try {
            const result = await dispatch(AgregarMarca(data)).unwrap()
            console.log(result)
            alert('marca guardada correctamente')
            e.target.reset()
            navigate('/todaslasmarcas')
        } catch (error) {
            console.error(error)
            console.log(error)
        }
    }
    

    return(
        <div>
            <form onSubmit={handleSubmit(handleSubmitMarca)}>
                <Input
                    type="text"
                    name="nombre"
                    label="Nombre"
                    register={register}
                    registerOptions= {{
                        required: true, maxLength: 30, minLength: 2 
                    }}
                    errors= {errors}
                    optionMsgErrors={{
                        required: "el nombre es obligatorio",
                        maxLength: "no puede incluir mas de 30 caracteres",
                        minLength: "al menos 3 caracteres"
                    }}
                />
                <br/><br/>
                <Input
                    type='text'
                    name='paisorigen'
                    label='País de origen'
                    register={register}
                    registerOptions= {{
                        required: true, maxLength: 50, minLength: 2
                    }}
                    errors= {errors}
                    optionMsgErrors={{
                        required: "el país de origen es obligatorio",
                        maxLength: "no puede incluir mas de 50 caracteres",
                        minLength: "al menos 2 caracteres"
                    }}
                />
                <Button type="submit" variant='info' size='lg'>Save</Button> {' '}
                <Button 
                    onClick={ e => { e.preventDefault(); navigate('/todaslasmarcas')}}
                    variant='info' size='lg'>
                    Cancel
                </Button> {' '}
            </form>
        </div>
    )
}

export default FormMarca