import { useDispatch, useSelector } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import { AgregarModelo } from '../Features/OrdenCompraSlice'

function FormModelo() {
    const {register, handleSubmit, formState : {errors}} = useForm()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams()
    console.log(params)

    const handleSubmitModelo = async (data, e) => {
        console.log('se llama al handle submit modelo')
        console.log(data)
        console.log(typeof(data.anio))
        try {
            const result = await dispatch(AgregarModelo(data)).unwrap()
            console.log(result)
            if (result.error){
                alert(result.message)
            } else {
                alert('modelo guardado correctamente')
                e.target.reset()
                navigate(`/marcas/modelos/${params.id}`)
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit(handleSubmitModelo)}>
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
                        minLength: "al menos 2 caracteres"
                    }}
                />
                <Input
                    type="number"
                    name="anio"
                    label="Año"
                    register={register}
                    registerOptions= {{
                        required: true, max: 2025, min: 2007 
                    }}
                    errors= {errors}
                    optionMsgErrors={{
                        required: "el año es obligatorio",
                        max: "no puede ser mayor a 2025",
                        min: "no puede ser menor a 2007"
                    }}
                />
                <Input
                    type="hidden"
                    name = "marca"
                    register={register}
                    errors={errors}
                    value={params.id}
                />
                <Button type="submit" variant='primary' size='lg'>Guardar</Button> {' '}
                <Button 
                    onClick={ e => { e.preventDefault(); navigate(`/marcas/modelos/${params.id}`)}}
                    variant='secondary' size='lg'>
                    Cancelar
                </Button> {' '}
            </form>
        </div>
    )
}

export default FormModelo