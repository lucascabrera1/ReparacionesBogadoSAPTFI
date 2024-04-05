import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodosLosProveedores,
  RecuperarProveedores,
  EstadoProveedores,
  EliminarProveedor
} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import ButtonApp from './Common/Button'
import { NavLink, useNavigate } from 'react-router-dom'

function FormProveedores() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const estadoproveedores = useSelector(EstadoProveedores)

  useEffect(()=>{
      if (estadoproveedores==="idle"){
        dispatch(RecuperarProveedores())
      }
    },[estadoproveedores])

  const handleDelete = (_id, razonsocial) => {
      let ok = window.confirm(`¿Está seguro de que quiere eliminar al proveedor: ${razonsocial}?`)
      if (ok) {dispatch(EliminarProveedor(_id))}
  }

  const handleEdit = (_id) => {
    navigate(`/proveedores/${_id}`);
  }

  return (
    <div>
        <h2>Proveedores</h2>
        <Table className= 'table table-success table-bordered border-dark table-sm'>
          <thead className='table-dark'>
              <tr>
                <th>Razón Social</th>
                <th>Cuit</th>
                <th>Dirección</th>
                <th>Email</th>
                <th>Localidad</th>
                <th>Teléfono</th>
                <th>Modificar / Eliminar</th>
              </tr>
          </thead>
          <tbody>
            {
              proveedores.map( proveedor => { 
                return <tr key={proveedor._id}>
                  <td>{proveedor.razonsocial}</td>
                  <td>{proveedor.cuit}</td>
                  <td>{proveedor.direccion}</td>
                  <td>{proveedor.email}</td>
                  <td>{proveedor.localidad}</td>
                  <td>{proveedor.telefono}</td>
                  <td><ButtonApp variant='primary'
                        onClick={()=> handleEdit(proveedor._id)}>
                        Modificar
                      </ButtonApp>
                      <ButtonApp variant='danger'
                        onClick={()=> handleDelete(proveedor._id, proveedor.razonsocial)}>
                        Eliminar
                      </ButtonApp> {' '}
                  </td>
                </tr>
                }
              )
            }
          </tbody>
      </Table>
      <ButtonApp variant='primary' 
        onClick={(e)=> { e.preventDefault(); navigate('/proveedor')}}>
        Nuevo
      </ButtonApp>
      <NavLink 
        onClick={e => { e.preventDefault(); navigate('/ordenesdecompra')}}>
        ...Atrás
      </NavLink>
    </div>
  )
}

export default FormProveedores