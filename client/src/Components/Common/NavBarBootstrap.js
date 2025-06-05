import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {logOut, selectCurrentUser} from '../../Features/AuthSlice'
import { useDispatch, useSelector } from 'react-redux';
import { reinicializar as reinicializarOcs } from '../../Features/OrdenCompraSlice';
import { reinicializar as reinicializarRemito} from '../../Features/RemitoSlice';
import { reinicializar as reinicializarUsuario} from '../../Features/UsersSlice';
import { reinicializar as reinicializarVenta } from '../../Features/VentaSlice';
import { reinicializar as reinicializarReparacion } from '../../Features/ReparacionesSlice';
import { reinicializar as reinicializarAuditoria, AgregarAuditoriaLogout } from '../../Features/AuditoriaSlice';

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
        dispatch(reinicializarVenta())
        dispatch(reinicializarReparacion())
        dispatch(reinicializarAuditoria())
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
                            <NavDropdown.Item onClick={()=> navegar('/remitos')}>Ingreso de Remitos</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navegar('/reporteremitos')}>Ver Reporte de Productos Faltantes</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title = "Ventas" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=> navegar('/ventas')} >Ventas</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navegar('/clientes')}>Clientes</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navegar('/reporteventas')}>Reporte de Ventas</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Órdenes de Reparaciones" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=> {navegar('/nuevopresupuesto')}}>Nuevo Presupuesto</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> {navegar('/presupuestosingresados')}}>Diagnosticar Presupuesto</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> {navegar('/presupuestosconfirmados')}}>Ingresar Reparación</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> {navegar('/finalizarreparacion')}}>Finalizar Reparación</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> {navegar('/reportereparaciones')}}>Reporte de Reparaciones</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> {navegar('/todaslasreparaciones')}}>Registro de Reparaciones</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Seguridad" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {navegar('/register')}}>Agregar Usuario</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/users')}}>Modificar o Eliminar Usuario</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Mis Reparaciones" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {navegar('/registerclient')}}>Registrarme</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/misreparaciones')}}>Ver mis Reparaciones</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Auditoría" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {navegar('/auditorialoginlogout')}}>Login y logout</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {navegar('/auditoriapresupuestos')}}>Presupuestos</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                {userlogged ? 
                    <li>
                        <NavLink   
                            to="/" 
                            onClick={async (e)=>{
                                console.log("onclick")
                                e.preventDefault()
                                ReinicializarEstado()
                                const newaud = {
                                    user : userlogged.nombreUsuario,
                                    action : 'logout'
                                }
                                const newaudsaved = await dispatch(AgregarAuditoriaLogout(newaud)).unwrap() 
                                console.log(newaud)
                                console.log(newaudsaved)
                            }}
                        >
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