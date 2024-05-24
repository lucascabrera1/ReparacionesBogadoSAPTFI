import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodosLosUsuarios,
  RecuperarUsuarios,
  EliminarUsuario,
  EstadoUsuarios,
  ErroresUsuarios
} from '../../Features/UsersSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'

function FormUsuarios() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const usuarios = useSelector(SeleccionarTodosLosUsuarios)
    console.log(usuarios)
    const estadousuarios = useSelector(EstadoUsuarios)
    const errorusuarios = useSelector(ErroresUsuarios)

    useEffect(()=>{
      if (estadousuarios==="idle"){
        dispatch(RecuperarUsuarios())
      }
    },[estadousuarios])

  
    const handleDelete = (_id, descripcion) => {
        let ok = window.confirm(`¿Está seguro de que quiere eliminar:  ${descripcion}?`)
        if (ok) {dispatch(EliminarUsuario(_id)); navigate('/users')}
    }

    return errorusuarios ? (<div className='alert alert-danger'>{errorusuarios}</div>) : (
        <div>
            <Table className= 'table table-success table-bordered border-dark'>
                <thead>
                    <tr>
                      <th>Nombre Usuario</th>
                      <th>Email</th>
                      <th>Fecha de creación</th>
                      <th>Última modificación</th>
                      <th>Roles del Usuario</th>
                      <th>Modificar</th>
                      <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    usuarios.map( usuario => { 
                      return <tr key={usuario._id}>
                        <td>{usuario.nombreUsuario}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.createdAt}</td>
                        <td>{usuario.updatedAt}</td>
                        <td>{ usuario.roles ? 
                          usuario.roles.map(rol => {
                            return rol.nombre.toString() + ", "
                          }) : null
                        }</td>
                        <td>
                          <NavLink
                            className="button"
                            style={{backgroundColor: 'yellow'}}
                            to={`/edit-user/${usuario._id}`} >
                              Modificar
                          </NavLink> {' '}
                        </td>
                        <td>
                          <Button 
                              variant='danger' size='lg' 
                              onClick={()=> handleDelete(usuario._id, usuario.nombreUsuario)}>
                                Eliminar
                            </Button> {' '}
                        </td>
                      </tr>
                    })}
                </tbody>
            </Table>
      <Button variant='primary' size='md'
        onClick={e=> { e.preventDefault(); navigate('/register')}}>
        Agregar nuevo
      </Button>
      <NavLink 
        onClick={e => { e.preventDefault(); navigate('/usuarios')}}>
        ...Atrás
      </NavLink>
    </div>)
}

export default FormUsuarios
