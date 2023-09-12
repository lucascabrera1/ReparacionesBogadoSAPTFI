import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodosLosProveedores,RecuperarProveedores, EstadoProveedores, EstadoMarcas, 
SeleccionarTodasLasMarcas, RecuperarMarcas} from '../Features/OrdenCompraSlice'
function DevolverProveedores() {

  const dispatch = useDispatch()
  
  const proveedores = useSelector(SeleccionarTodosLosProveedores)
  const marcas = useSelector(SeleccionarTodasLasMarcas)
  const estadoproveedores = useSelector(EstadoProveedores)
  const estadomarcas = useSelector(EstadoMarcas)

  useEffect(()=>{
      if (estadoproveedores==="idle"){
        dispatch(RecuperarProveedores())
      }
    },[estadoproveedores])
  
  useEffect (() => {
    if (estadomarcas === "idle"){
      dispatch(RecuperarMarcas())
    }
  }, [estadomarcas])

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