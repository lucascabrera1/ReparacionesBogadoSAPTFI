import { NavLink } from 'react-router-dom'

function FormGestionOC() {
  return (
    <ul style={{marginLeft : '36px'}}>
        <li><NavLink to={'/todaslasmarcas'}>Gestionar Marcas</NavLink></li>
        <li><NavLink to={'/proveedores'}>Gestionar Proveedores</NavLink></li>
        <li><NavLink to={'/productos'}>Gestionar Productos</NavLink></li>
        <li><NavLink to={'/todaslasordenesdecompra'}>Gestionar Ordenes de Compra</NavLink></li>
    </ul>
  )
}

export default FormGestionOC