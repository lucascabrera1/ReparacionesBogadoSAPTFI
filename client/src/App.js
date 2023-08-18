import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from '../src/Util/ProtectedRoute.js'
import FormTodasLasOC from './Components/FormTodasOrdenesDeCompra'
import NotFoundPage from './Components/NotFoundPage'
import './App.css';

function App() {
  return <div>
    <header className='App-header'><h1>REPARACIONES BOGADO</h1></header>
      <div className='items-center justify-center'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FormTodasLasOC/>} />
          {/* <Route path='/home' element={<Home/>} />
          <Route path='/ordenesdecompra' element={<ProtectedRoute><Users/></ProtectedRoute>}/>
          <Route path='/edit-user/:id' element={<ProtectedRoute><UserForm/></ProtectedRoute>}/>
          <Route path='/newuser' element={<UserForm/>}/> 
          <Route path='/login' element= {<Login/>}/>*/}
          <Route path='*' element= {<NotFoundPage/>}/>
        </Routes>
      </BrowserRouter>
      </div>
      <footer className='App-footer'><h2>Realizado por Lucas Cabrera</h2></footer>
  </div>
}

export default App;
