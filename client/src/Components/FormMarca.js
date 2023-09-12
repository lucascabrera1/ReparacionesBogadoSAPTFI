import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from './Common/Button'
import Input from './Common/Input'
import {AgregarMarca} from '../Features/OrdenCompraSlice.js'

function FormMarca () {
    const {register, handleSubmit, reset, getValues, formState : {errors}} = useForm()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const marcas = useSelector(state => state.ordenesDeCompra.marcas);

    console.log(marcas)

    const handleSubmitMarca = async (data, e) => {
        console.log('se llama al handle submit marca')
        try {
            await dispatch(AgregarMarca(data)).unwrap()
            alert('marca guardada correctamente')
            e.target.reset()
        } catch (error) {
            console.error(error)
        }
    }
    

    return(
        <div>
            <form onSubmit={handleSubmit(handleSubmitMarca)}>
                <Input
                    type="text"
                    name="nombre"
                    label="nombre"
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
                <Button type="submit" className={``}>Save</Button>
                <Button onClick={ e => { e.preventDefault(); navigate('/todaslasmarcas')}}>Cancel</Button>
            </form>
        </div>
    )
}

export default FormMarca