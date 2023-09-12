import { useDispatch, useSelector } from 'react-redux'
import {NavLink, useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from './Common/Button'
import Link from './Common/Link'
import Input from './Common/Input'
import {RecuperarMarcas, EstadoMarcas, SeleccionarTodasLasMarcas} from '../Features/OrdenCompraSlice.js'
import { useEffect } from 'react'

function FormMarcas() {
    const dispatch = useDispatch()
    const marcas = useSelector(SeleccionarTodasLasMarcas)
    const estadomarcas = useSelector(EstadoMarcas)
    const navigate = useNavigate()

    console.log(estadomarcas)

    useEffect(()=> {
        if (estadomarcas === "idle") {dispatch(RecuperarMarcas())}
    }, [estadomarcas])

    console.log(estadomarcas)

    return (<div>
        <h2>Marcas Recuperadas</h2>
        {
            <table style={{border: "5px solid black"}}>
                <thead>
                    <tr style={{border: "2px solid black"}}>
                        <th style={{border: "2px solid black"}}>Nombre</th>
                        <th style={{border: "2px solid black"}}>Pais de Origen</th>
                    </tr>
                </thead>
                <tbody style={{border: "2px solid black"}}>
                    { 
                        marcas.map(marca => {
                            return <tr key={marca._id} style={{border: "2px solid black"}}>
                                <td style={{border: "2px solid black"}}>{marca.nombre}</td>
                                <td style={{border: "2px solid black"}}>{marca.paisorigen}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        }
        <Button onClick={ e => { e.preventDefault(); navigate('/nuevamarca')}}>Agregar</Button>
        <Button>Modificar</Button>
        <Button>Eliminar</Button>
        <NavLink onClick={e => { e.preventDefault(); navigate('/ordenesdecompra')}}>...Atrás</NavLink>
    </div>)
}

export default FormMarcas