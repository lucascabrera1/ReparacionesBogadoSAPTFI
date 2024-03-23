import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavBarBootstrap() {

    return (
        <Navbar expand="lg" bg="primary" data-bs-theme="dark">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link href="/">Inicio</Nav.Link>
                        <NavDropdown title="Ordenes de Compra" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/todaslasmarcas">Marcas</NavDropdown.Item>
                            <NavDropdown.Item href="/proveedores">Proveedores</NavDropdown.Item>
                            <NavDropdown.Item href="/productos">Productos</NavDropdown.Item>
                            <NavDropdown.Item href="/todaslasordenesdecompra">Ordenes de Compra</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/ventas">Ventas</Nav.Link>
                        <Nav.Link href="/remitos">Ingreso de Remitos</Nav.Link>
                        <Nav.Link href="/reparaciones">Ordenes de Reparaciones</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
    )

}