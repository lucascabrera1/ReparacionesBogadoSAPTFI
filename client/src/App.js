import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from '../src/Util/ProtectedRoute.js'
import FormProveedores from './Components/FormProveedores.js'
import NotFoundPage from './Components/NotFoundPage'
import NavBarPrincipal from './Components/Common/NavBarPrincipal.js'
import './App.css';
import FormMarca from './Components/FormMarca.js'
import FormMarcas from './Components/FormMarcas.js'
import FormGestionOC from './Components/FormGestionOC.js'
import FormProveedor from './Components/FormProveedor.js'
import FormProducto from './Components/FormProducto.js'
import FormProductos from './Components/FormProductos.js'
import FormOrdenesCompra from './Components/FormOrdenesCompra.js'
import FormOrdenCompra from './Components/FormOrdenCompra.js'
import FormLineasCompra from './Components/FormLineasCompra.js'
import FormRemitos from './Components/FormRemitos.js'
import FormLineasRemito from './Components/FormLineasRemito.js'
import FormRemito from './Components/FormRemito.js'
import ReporteProveedores from './Components/Reportes/ReporteProveedores.js'
import Welcome from './Components/Welcome.js'
//import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import NavBarBootstrap from './Components/Common/NavBarBootstrap.js'
import Login from './Components/Auth/LoginForm.js'
import RegisterForm from './Components/Auth/RegisterForm.js'
import FormUsuarios from './Components/Auth/UsersForm.js'
import FormLinkResetPwd from './Components/FormLinkResetPwd.js'
import FormResetPwd from './Components/FormResetPwd.js'
import FormChangePassword from './Components/FormChangePassword.js'
import FormReporteRemitos from './Components/Reportes/FormReporteRemitos.js'
import FormVentas from './Components/FormVentas.js'
import FormLineasVenta from './Components/FormLineasVenta.js'
import FormVenta from './Components/FormVenta.js'
import FormClientes from './Components/FormClientes.js'
import FormCliente from './Components/FormCliente.js'
import FormModelos from './Components/FormModelos.js'
import FormModelo from './Components/FormModelo.js'
import RegisterUserForm from './Components/Auth/RegisterUserForm.js'
import FormMisReparaciones from './Components/FormMisReparaciones.js'
import FormNuevoPresupuesto from './Components/FormNuevoPresupuesto.js'
import FormPresupuestosIngresados from './Components/FormPresupuestosIngresados.js'
import FormDiagnosticarPresupuesto from './Components/FormDiagnosticarPresupuesto.js'

function App() {
  return <div  className="container-fluid">
    <header className ='d-flex flex-column justify-content-center align-items-center bg-dark text-success'>
      <h1>REPARACIONES BOGADO</h1>
    </header>
    <div className='items-center justify-center'>
      <BrowserRouter>
        <NavBarBootstrap/>
          <Routes>
            <Route path='/ordenesdecompra' element={<FormGestionOC/>}/>
            <Route path='/nuevamarca' element={<FormMarca/>} />
            <Route path='*' element= {<NotFoundPage/>}/>
            <Route path='/todaslasmarcas' element={<ProtectedRoute><FormMarcas/></ProtectedRoute>}/>
            <Route path='/proveedores' element={<ProtectedRoute><FormProveedores/></ProtectedRoute>}/>
            <Route path='/productos' element={<ProtectedRoute><FormProductos/></ProtectedRoute>}/>
            <Route path='/producto' element={<FormProducto/>} />
            <Route path='/productos/:id' element={<FormProducto/>} />
            <Route path='/proveedor' element= {<FormProveedor/>}/>
            <Route path='/proveedores/:id' element= {<FormProveedor/>}/>
            <Route path='/todaslasordenesdecompra' element= {<ProtectedRoute><FormOrdenesCompra/></ProtectedRoute>}/>
            <Route path='/register' element= {<ProtectedRoute><RegisterForm/></ProtectedRoute>}/>
            <Route path='/nuevaordendecompra' element={<ProtectedRoute><FormOrdenCompra/></ProtectedRoute>}/>
            <Route path='/ordenesdecompra/:id' element={<ProtectedRoute><FormLineasCompra/></ProtectedRoute>}></Route>
            <Route path='/ventas/venta/:id' element={<ProtectedRoute><FormLineasVenta/></ProtectedRoute>}></Route>
            <Route path='/remitos' element={<ProtectedRoute><FormRemitos/></ProtectedRoute>}/>
            <Route path='/nuevoremito' element={<ProtectedRoute><FormRemito/></ProtectedRoute>}/>
            <Route path='/users' element={<ProtectedRoute><FormUsuarios/></ProtectedRoute>} />
            <Route path='/remitos/:id' element={<ProtectedRoute><FormLineasRemito/></ProtectedRoute>}/>
            <Route path='/edit-user/:id' element={<ProtectedRoute><RegisterForm/></ProtectedRoute>}/>
            <Route path='/reporteproveedores' element={<ProtectedRoute><ReporteProveedores/></ProtectedRoute>}/>
            <Route path='/reporteremitos' element={<ProtectedRoute><FormReporteRemitos/></ProtectedRoute>}/>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/reset-password' element={<FormLinkResetPwd/>}></Route>
            <Route path='/' element= {<Welcome/>}/>
            <Route path='/reset-password/:id/:token' element={<FormResetPwd/> }/>
            <Route path='/change-password/:id' element={<ProtectedRoute><FormChangePassword/></ProtectedRoute>}/>
            <Route path='/ventas' element={<ProtectedRoute><FormVentas/></ProtectedRoute>}></Route>
            <Route path='/nuevaventa' element={<ProtectedRoute><FormVenta/></ProtectedRoute>}></Route>
            <Route path='/clientes' element= {<ProtectedRoute><FormClientes/></ProtectedRoute>}></Route>
            <Route path='/clientes/:id' element= {<ProtectedRoute><FormCliente/></ProtectedRoute>}></Route>
            <Route path='/nuevocliente' element= {<ProtectedRoute><FormCliente/></ProtectedRoute>}></Route>
            <Route path='/marcas/modelos/:id' element = {<ProtectedRoute><FormModelos/></ProtectedRoute>}></Route>
            <Route path='/nuevomodelo/:id' element = {<ProtectedRoute><FormModelo/></ProtectedRoute>}></Route>
            <Route path='/registerclient' element = {<RegisterUserForm/>}></Route>
            <Route path='/misreparaciones' element = {<ProtectedRoute><FormMisReparaciones/></ProtectedRoute>}></Route>
            <Route path='/nuevopresupuesto' element = {<ProtectedRoute><FormNuevoPresupuesto/></ProtectedRoute>}></Route>
            <Route path='/presupuestosingresados' element = {<ProtectedRoute><FormPresupuestosIngresados/></ProtectedRoute>}></Route>
            <Route path='/diagnosticar/:id' element = {<ProtectedRoute><FormDiagnosticarPresupuesto/></ProtectedRoute>}></Route>
            {/*<Route path='/' element={<FormTodasLasOC/>} />
            <Route path='/home' element={<Home/>} />
                                                                                                                
            
            <Route path='/newuser' element={<UserForm/>}/> 
            <Route path='/login' element= {<Login/>}/>
            <Route path='*' element= {<NotFoundPage/>}/>*/}
          </Routes>
      </BrowserRouter>
    </div>
    <footer className=''><em>© Realizado por Lucas Cabrera</em></footer>
  </div>
}

export default App;
