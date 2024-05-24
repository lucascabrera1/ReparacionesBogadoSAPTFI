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
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import NavBarBootstrap from './Components/Common/NavBarBootstrap.js'
import Login from './Components/Auth/LoginForm.js'
import RegisterForm from './Components/Auth/RegisterForm.js'
import FormUsuarios from './Components/Auth/UsersForm.js'

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
            <Route path='/remitos' element={<ProtectedRoute><FormRemitos/></ProtectedRoute>}/>
            <Route path='/nuevoremito' element={<ProtectedRoute><FormRemito/></ProtectedRoute>}/>
            <Route path='/users' element={<ProtectedRoute><FormUsuarios/></ProtectedRoute>} />
            <Route path='/remitos/:id' element={<ProtectedRoute><FormLineasRemito/></ProtectedRoute>}/>
            <Route path='/edit-user/:id' element={<ProtectedRoute><RegisterForm/></ProtectedRoute>}/>
            <Route path='/reporteproveedores' element={<ProtectedRoute><ReporteProveedores/></ProtectedRoute>}/>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/' element= {<Welcome/>}/>
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
