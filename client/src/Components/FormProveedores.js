import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodosLosProveedores,
  RecuperarProveedores,
  EstadoProveedores,
  EliminarProveedor
} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
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

  return (
    <div>
        <Table className= 'table-success table-bordered border-dark'>
          <thead>
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
                  <td><Button variant='secondary' size='lg' >
                          Modificar
                      </Button> {' '}
                      <Button variant='danger' size='lg' 
                        onClick={()=> handleDelete(proveedor._id, proveedor.razonsocial)}>
                        Eliminar
                      </Button> {' '}
                  </td>
                </tr>
                }
              )
            }
          </tbody>
      </Table>
      <NavLink 
        onClick={e => { e.preventDefault(); navigate('/ordenesdecompra')}}>
        ...Atrás
      </NavLink>
    </div>
  )
}

export default FormProveedores