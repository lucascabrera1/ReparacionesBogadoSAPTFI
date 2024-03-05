import { NavLink } from 'react-router-dom'

function FormGestionRemitos() {
  return (
    <ul style={{marginLeft : '36px'}}>
        <li><NavLink to={'/remitos'}>Gestionar Remitos</NavLink></li>
    </ul>
  )
}

export default FormGestionRemitos