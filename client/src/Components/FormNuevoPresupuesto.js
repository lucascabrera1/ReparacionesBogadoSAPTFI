import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {AgregarPresupuesto, EstadoUsuarios, RecuperarUsuarios, SeleccionarTodosLosUsuarios,
    EstadoMarcas, SeleccionarTodasLasMarcas, RecuperarMarcas,
    EstadoModelos, SeleccionarModelos, RecuperarModelos
} from "../Features/ReparacionesSlice"
import { selectCurrentUser } from "../Features/AuthSlice";
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form'
import Input from '../Components/Common/Input'

function FormNuevoPresupuesto() {

    const {register, handleSubmit, formState : {errors}} = useForm({
        defaultValues : {
            fechaIngreso : new Date()
        }
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userlogged = useSelector(selectCurrentUser)
    //iser = acronimo de is encargado de reparaciones
    //const [iser, setIser] = useState(false)
    let iser = false
    userlogged.roles.map(rol => {
        if (rol.nombre === "Encargado de Reparaciones") iser = true
    })
    
   /*  userlogged.roles.map(rol => {
        return rol.nombre === "Encargado de Reparaciones" ? setIser(true) : setIser(false);
    }) */ 

    const handleSubmitPresupuesto = async (data, e) => {
        console.log("pasa por el handle submit presupuesto")
        console.log(data)
        try {
            const result = await dispatch(AgregarPresupuesto(data)).unwrap()
            console.log(result)
            if (result.error) {
                alert(result.message)
            } else {
                alert('presupuesto guardado correctamente')
                e.target.reset()
                navigate(`/nuevopresupuesto`)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const estadousuarios = useSelector(EstadoUsuarios)
    const usuarios = useSelector(SeleccionarTodosLosUsuarios)
    const estadomarcas = useSelector(EstadoMarcas)
    const marcas = useSelector(SeleccionarTodasLasMarcas)
    const estadomodelos = useSelector(EstadoModelos)
    const modelos = useSelector(SeleccionarModelos)

    const [marca, setMarca] = useState({})

    console.log(usuarios)
    console.log(marca)

    useEffect(() => {
        if (estadousuarios === "idle") {
            dispatch(RecuperarUsuarios())
        }
    }, [estadousuarios])

    useEffect((e) => {
        if (estadomarcas === "idle") {
            dispatch(RecuperarMarcas())
        }
    },[estadomarcas])

    useEffect (() => {
        dispatch(RecuperarModelos(marca))
    }, [marca])

    const optionUsuarios = usuarios.map(user => <option
        key={user._id}
        value={user._id}
    >
        {user.nombreUsuario}
    </option>)

    optionUsuarios.unshift(<option value="" key="">Seleccione un usuario</option>)

    const optionMarcas = marcas.map(marca => <option
        key={marca._id}
        value={marca._id}
    >
        {marca.nombre}
    </option>)

    optionMarcas.unshift(<option value="" key="">Seleccione una marca</option>)

    const optionModelos = modelos.map(modelo => <option
        key={modelo._id}
        value={modelo._id}
    >
        {modelo.nombre}
    </option>)

    optionModelos.unshift(<option value="" key="">Seleccione un modelo</option>)

    return (
        iser ? <div>
            <Form onSubmit={handleSubmit(handleSubmitPresupuesto)}>
                <p>Ingrese un nuevo Presupuesto de Reparación</p>
                <Input
                    type="number"
                    name="codigo"
                    placeholder="Código"
                    register={register}
                    registerOptions= {{required: true, minLength: 1, maxLength: 4, min: 0}}
                    optionMsgErrors={{
                      required: "El codigo es obligatorio",
                      minLength : "Minimo 1 digito",
                      maxLength : "Máximo 4 dígitos",
                      min: "El valor debe ser mayor o igual a 0"
                    }}
                    errors={errors}
                />
                <label>Cliente</label>
                <Form.Select
                    aria-label='Cliente'
                    className='col-md-2'
                    size='sm'
                    name='cliente'
                    {...register('cliente')}
                >
                    {optionUsuarios}
                </Form.Select>
                <div style={{width: "1000px"}}>
                    <Input
                        type="textarea"
                        name="falla"
                        label="Falla"
                        register={register}
                        registerOptions= {{
                            required: true, maxLength: 300, minLength: 2 
                        }}
                        errors= {errors}
                        optionMsgErrors={{
                            required: "la falla es obligatoria",
                            maxLength: "no puede incluir mas de 300 caracteres",
                            minLength: "al menos 2 caracteres"
                        }}
                    />
                </div>
                <label>Marca</label>
                <Form.Select
                    aria-label='Marca'
                    className='col-md-2'
                    size='sm'
                    name='marca'
                    {...register('marca')}
                    onChange={(e) => {
                        e.preventDefault()
                        setMarca(e.target.value)
                    }}
                >
                    {optionMarcas}
                </Form.Select>
                <label>Modelo</label>
                <Form.Select
                    aria-label='Modelo'
                    className='col-md-2'
                    size='sm'
                    name='modelo'
                    {...register('modelo')}
                >
                    {optionModelos}
                </Form.Select>
                <Input
                    type="hidden"
                    name="fechaIngreso"
                    register={register}
                    errors={errors}
                />
                <Button
                type='submit' 
                style={{
                    backgroundColor: 'green',
                    textAlign: 'right'
                }}
            >
                Generar nuevo presupuesto
            </Button>
            <Button
                variant='secondary'
                onClick={e => { e.preventDefault(); navigate('/')}}>
                ...Atrás
            </Button>
            </Form>
            
        </div> : <div className='alert alert-danger'>
            {userlogged.nombreUsuario} no tiene el rol de encargado de reparaciones
        </div>
    )
}

export default FormNuevoPresupuesto