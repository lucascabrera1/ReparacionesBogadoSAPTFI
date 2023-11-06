import React from 'react'
import Link from './Common/Link'
import { useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

function FormGestionOC() {
    const navigate = useNavigate()
  return (
    <ul style={{marginLeft : '36px'}}>
        <li><NavLink to={'/todaslasmarcas'}>Gestionar Marcas</NavLink></li>
        <li><NavLink to={'/proveedores'}>Gestionar Proveedores</NavLink></li>
        <li><NavLink to={'/productos'}>Gestionar Productos</NavLink></li>
        <li><NavLink>Gestionar Ordenes de Compra</NavLink></li>
        <li><NavLink>Gestionar Formas de Pago</NavLink></li>
    </ul>
  )
}

export default FormGestionOC