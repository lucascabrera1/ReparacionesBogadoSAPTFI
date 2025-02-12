import { useDispatch, useSelector } from 'react-redux'
import {NavLink, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import ButtonApp from './Common/Button.js'
import Table from 'react-bootstrap/Table'
import {RecuperarMarcas, EstadoMarcas, SeleccionarTodasLasMarcas, 
EliminarMarca, ErroresMarcas} from '../Features/OrdenCompraSlice.js'

function FormMarcas() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const erroresmarca = useSelector(ErroresMarcas)
    const marcas = useSelector(SeleccionarTodasLasMarcas)
    const estadomarcas = useSelector(EstadoMarcas)

    console.log(marcas)

    useEffect(()=> {
        if (estadomarcas === "idle") {dispatch(RecuperarMarcas())}
    }, [estadomarcas])

    const handleDelete = (_id, nombre) => {
        let ok = window.confirm(`¿Está seguro de que quiere eliminar a la marca: ${nombre}?`)
        if (ok) {dispatch(EliminarMarca(_id))}
    }

    return erroresmarca ? (<div className='alert alert-danger'>{erroresmarca}</div>) : (<div>
        <h2>Todas las marcas</h2>
        {
            <Table className= 'table table-success table-bordered border-dark table-sm'>
                <thead className='table-dark'>
                    <tr>
                        <th>Nombre</th>
                        <th>Pais de Origen</th>
                        <th>Modelos</th>
                        <th>Eliminar...</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        marcas.map(marca => {
                            return <tr key={marca._id}>
                                <td>{marca.nombre}</td>
                                <td>{marca.paisorigen}</td>
                                <td><NavLink to={`/marcas/modelos/${marca._id}`}>Ver Modelos</NavLink></td>
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