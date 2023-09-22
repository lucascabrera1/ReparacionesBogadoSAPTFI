import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from '../src/Util/ProtectedRoute.js'
import FormProveedores from './Components/FormProveedores.js'
import NotFoundPage from './Components/NotFoundPage'
import NavBarPrincipal from './Components/Common/NavBarPrincipal.js'
import './App.css';
import FormMarca from './Components/FormMarca.js'
import FormMarcas from './Components/FormMarcas.js'
import FormGestionOC from './Components/FormGestionOC.js'

function App() {
  return <div>
    <header className='App-header'>
      <h1>REPARACIONES BOGADO</h1>
      <h2>BIENVENIDO AL MENÚ PRINCIPAL DE REPARACIONES BOGADO</h2>
      <h3>SELECCIONE LA SECCIÓN A LA QUE NECESITE INGRESAR</h3>
    </header>
    <div className='items-center justify-center'>
      <BrowserRouter>
        <NavBarPrincipal/>
        
          <Routes>
            <Route path='/ordenesdecompra' element={<FormGestionOC/>}/>
            <Route path='/nuevamarca' element={<FormMarca/>} />
            <Route path='*' element= {<NotFoundPage/>}/>
            <Route path='/todaslasmarcas' element={<FormMarcas/>}/>
            <Route path='/proveedores' element={<FormProveedores/>}/>
            {/*<Route path='/' element={<FormTodasLasOC/>} />
            <Route path='/home' element={<Home/>} />
            
            <Route path='/edit-user/:id' element={<ProtectedRoute><UserForm/></ProtectedRoute>}/>
            <Route path='/newuser' element={<UserForm/>}/> 
            <Route path='/login' element= {<Login/>}/>
            <Route path='*' element= {<NotFoundPage/>}/>*/}
          </Routes>
      </BrowserRouter>
    </div>
      <footer className='App-footer'><h2>Realizado por Lucas Cabrera</h2></footer>
  </div>
}

export default App;
