import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import { useParams } from 'react-router'
import { RecuperarModelos } from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import {useNavigate } from 'react-router-dom'

function FormModelos() {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()

    const [modelos, setModelos] = useState([])

    function atras () {
        navigate('/todaslasmarcas')
    }

    function nuevo () {
        navigate(`/nuevomodelo/${params.id}`)
    }

    useEffect(()=>{
        async function RecuperarModelosDeUnaMarca() {
            if (params.id) {
                const modelos = await (dispatch(RecuperarModelos(params.id)).unwrap())
                setModelos(modelos.data)
            }
        }
        RecuperarModelosDeUnaMarca()
    }, [params])

    return (
        <div>
            <Table className='table table-success table-bordered border-dark'>
                <thead>
                    <th>Nombre</th>
                    <th>Año</th>
                </thead>
                <tbody>
                    {
                        modelos.map(model => {
                            return <tr key={model._id}>
                                <td>{model.nombre}</td>
                                <td>{model.anio}</td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
            <Button onClick={nuevo}>Agregar</Button>
            <Button onClick={atras}>Atrás</Button>
        </div>
    )
}

export default FormModelos