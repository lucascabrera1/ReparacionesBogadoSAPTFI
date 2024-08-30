import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodosLosProductos,
  RecuperarProductos,
  EstadoProductos,
  EliminarProducto,
  ErroresProductos
} from '../Features/OrdenCompraSlice'
import {EstadoProductos as Epr} from '../Features/RemitoSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'

function FormProductos() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const productos = useSelector(SeleccionarTodosLosProductos)
    const estadoproductos = useSelector(EstadoProductos)
    const errorproductos = useSelector(ErroresProductos)
    const epr = useSelector(Epr)

    console.log("epr")
    console.log(epr)
    console.log("epr")

    useEffect(()=>{
      if (estadoproductos==="idle"){
        dispatch(RecuperarProductos())
      }
    },[estadoproductos])

    useEffect(()=>{
      if (epr==="idle"){
        dispatch(RecuperarProductos())
      }
    },[epr])
  
    const handleDelete = (_id, descripcion) => {
      let ok = window.confirm(`¿Está seguro de que quiere eliminar:  ${descripcion}?`)
      if (ok) {dispatch(EliminarProducto(_id))}
    }

    return errorproductos ? (<div className='alert alert-danger'>{errorproductos}</div>) : (
        <div>
            <Table className= 'table table-success table-bordered border-dark'>
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Proveedor</th>
                        <th>Marca</th>
                        <th>Código</th>
                        <th>Precio de Compra</th>
                        <th>Precio de Venta</th>
                        <th>Punto de Pedido</th>
                        <th>Stock</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                      productos.map( producto => { 
                          return <tr key={producto._id}>
                            <td>{producto.descripcion}</td>
                            <td>{producto.categoria}</td>
                            <td>{producto.proveedor}</td>
                            <td>{producto.marca}</td>
                            <td>{producto.codigo}</td>
                            <td>{producto.preciocompra}</td>
                            <td>{producto.precioventa}</td>
                            <td>{producto.puntopedido}</td>
                            <td>{producto.stock}</td>
                            <td>
                              <NavLink
                                className="button"
                                style={{backgroundColor: 'yellow'}}
                                to={`/productos/${producto._id}`} >
                                  Modificar
                              </NavLink> {' '}
                            </td>
                            <td>
                              <Button 
                                  variant='danger' size='lg' 
                                  onClick={()=> handleDelete(producto._id, producto.descripcion)}>
                                    Eliminar
                                </Button> {' '}
                            </td>
                          </tr>
                        }
                      )
                    }
                </tbody>
            </Table>
      <Button variant='primary' size='md'
        onClick={e=> { e.preventDefault(); navigate('/producto')}}>
        Agregar nuevo
      </Button>
      <NavLink 
        onClick={e => { e.preventDefault(); navigate('/ordenesdecompra')}}>
        ...Atrás
      </NavLink>
    </div>)
}

export default FormProductos