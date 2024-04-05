import { useDispatch, useSelector } from 'react-redux'
import {NavLink, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import ButtonApp from './Common/Button.js'
import Table from 'react-bootstrap/Table'
import {RecuperarMarcas, EstadoMarcas, SeleccionarTodasLasMarcas, EliminarMarca} from '../Features/OrdenCompraSlice.js'

function FormMarcas() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const marcas = useSelector(SeleccionarTodasLasMarcas)
    const estadomarcas = useSelector(EstadoMarcas)

    useEffect(()=> {
        if (estadomarcas === "idle") {dispatch(RecuperarMarcas())}
    }, [estadomarcas])

    const handleDelete = (_id, nombre) => {
        let ok = window.confirm(`¿Está seguro de que quiere eliminar a la marca: ${nombre}?`)
        if (ok) {dispatch(EliminarMarca(_id))}
    }

    return (<div>
        <h2>Marcas Recuperadas</h2>
        {
            <Table className= 'table table-success table-bordered border-dark table-sm'>
                <thead className='table-dark'>
                    <tr>
                        <th>Nombre</th>
                        <th>Pais de Origen</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        marcas.map(marca => {
                            return <tr key={marca._id}>
                                <td>{marca.nombre}</td>
                                <td>{marca.paisorigen}</td>
                                <td><ButtonApp variant='danger' 
                                    onClick={()=> handleDelete(marca._id, marca.nombre)}>
                                        Eliminar
                                    </ButtonApp> {' '}
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
        }
        <ButtonApp 
        onClick={ e => { e.preventDefault(); navigate('/nuevamarca')}}
        variant='info' size='lg'>
            Agregar
        </ButtonApp> {' '}
        <NavLink onClick={e => { e.preventDefault(); navigate('/ordenesdecompra')}}>...Atrás</NavLink>
    </div>)
}

export default FormMarcas