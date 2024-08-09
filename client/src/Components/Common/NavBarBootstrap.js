import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {logOut, selectCurrentUser} from '../../Features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux';
import { reinicializar as reinicializarOcs } from '../../Features/OrdenCompraSlice';
import { reinicializar as reinicializarRemito} from '../../Features/RemitoSlice';
import { reinicializar as reinicializarUsuario} from '../../Features/UsersSlice'

export default function NavBarBootstrap() {
    const navigate = useNavigate();
    const navegar = function(url) {
        navigate(url);
    }
    const dispatch = useDispatch()
    const ReinicializarEstado = () => {
        dispatch(logOut())
        dispatch(reinicializarOcs())
        dispatch(reinicializarRemito())
        dispatch(reinicializarUsuario())
    }
    const userlogged = useSelector(selectCurrentUser)

    return ( 
        <Navbar expand="lg" bg="primary" data-bs-theme="dark">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <NavLink className="nav-link" to="/">Inicio</NavLink>
                        <NavDropdown title="Ordenes de Compra" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {navegar('/todaslasmarcas')}}>Marcas</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/proveedores')}}>Proveedores</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/productos')}}>Productos</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/todaslasordenesdecompra')}}>Ordenes de Compra</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/reporteproveedores')}}>Reporte Proveedores</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Remitos" id="basic-nav-dropdown">
                            <NavLink className="nav-link" to="/remitos">Ingreso de Remitos</NavLink>
                            <NavLink className="nav-link" to="/reporteremitos">Ver Reporte de Productos Faltantes</NavLink>
                        </NavDropdown>
                        <NavLink className="nav-link" to="/ventas">Ventas</NavLink>
                        
                        <NavLink className="nav-link" to="/reparaciones">Ordenes de Reparaciones</NavLink>
                        <NavDropdown title="Seguridad" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {navegar('/register')}}>Agregar Usuario</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/users')}}>Modificar o Eliminar Usuario</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                {userlogged ? 
                    <li>
                        <NavLink to="/" onClick={()=>{
                            ReinicializarEstado()
                        }}>
                            <a >Salir</a>
                        </NavLink>
                        <p>{userlogged.nombreUsuario}</p>
                        <NavLink to={`change-password/${userlogged._id}`}>Cambiar contraseña</NavLink>
                    </li>
                    :<NavLink to="/login">Iniciar sesion</NavLink>
                }
        </Navbar>
    )
}