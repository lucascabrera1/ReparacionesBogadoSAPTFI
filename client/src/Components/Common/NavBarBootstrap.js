import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {logOut, selectCurrentUser} from '../../Features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux';

export default function NavBarBootstrap() {

    const navigate = useNavigate();
    const navegar = function(url) {
        navigate(url);
    }
    const dispatch = useDispatch()
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
                        </NavDropdown>
                        <NavLink className="nav-link" to="/ventas">Ventas</NavLink>
                        <NavLink className="nav-link" to="/remitos">Ingreso de Remitos</NavLink>
                        <NavLink className="nav-link" to="/reparaciones">Ordenes de Reparaciones</NavLink>
                        <NavDropdown title="Ordenes de Compra" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {navegar('/register')}}>Agregar Usuario</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/register:/id')}}>Modificar Usuario</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                {userlogged ? 
                    <li>
                        <Nav.Link href="/login" onClick={()=>{dispatch(logOut())}}>
                            <a >Salir</a>
                        </Nav.Link>
                        <p>{userlogged.nombreUsuario}</p>
                    </li>
                    :<NavLink to="/login">Iniciar sesion</NavLink>
                }
        </Navbar>
    )
}