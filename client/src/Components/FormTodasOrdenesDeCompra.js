import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {SeleccionarTodosLosProveedores, RecuperarProveedores, EstadoProveedores} from '../Features/OrdenCompraSlice'
/* import Button from './Common/Button';
import styles from './style.module.css' */
function DevolverProveedores() {

  const dispatch = useDispatch()
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  console.log(proveedores)
  const estadoproveedores = useSelector(EstadoProveedores)

  useEffect(()=>{
      if (estadoproveedores==="idle")
        dispatch(RecuperarProveedores())
    },[estadoproveedores])

    return (
        <div>
          <h1 className='rounded-md bg-black'>Cantidad de proveedores registrados al momento: {proveedores.length}</h1>
            <div className='grid grid-cols-3 gap-5 self-center'>
              {proveedores.map( proveedor => {
                return (
                  <div key={proveedor._id} className='bg-neutral-800 p-1 rounded-md'>
                      <header key={proveedor._id} className='rounded-sm place-self-center'>
                        <h2>Proveedor id: {proveedor._id}</h2>
                        <p>razón social: {proveedor.razonsocial}</p>
                        <p>cuit: {proveedor.cuit}</p>
                        <p>direccion: {proveedor.direccion}</p>
                        <p>email:  {proveedor.email}</p>
                        <p>localidad: {proveedor.localidad}</p>
                        <p>telefono: {proveedor.telefono}</p>
                      </header>
                  </div>
              )})}
            </div>
        </div>
    )
}

export default DevolverProveedores