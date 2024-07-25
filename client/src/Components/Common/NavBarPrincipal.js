import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentUser } from '../../Features/AuthSlice';
import { NavLink } from 'react-router-dom';


export default function () {
    const dispatch = useDispatch()
    const userlogged = useSelector(selectCurrentUser)
    return (
        <navbar>
            <ul>
                <li><NavLink to="/ordenesdecompra">Ordenes de Compra</NavLink></li>
                <li><NavLink to="/ventas">Ventas</NavLink></li>
                <li><NavLink to="/remitos">Ingreso de Remitos</NavLink></li>
                <li><NavLink to="/reparaciones">Ordenes de Reparaciones</NavLink></li>
                <li><NavLink to="/reporteproveedores">Reporte de Proveedores</NavLink></li>
                
            </ul>
            {
                userlogged ?
                <div>
                    <li>
                        <NavLink to="/">
                            <a onClick={()=> {
                                dispatch(logOut())
                            }}>
                                Salir
                            </a>
                        </NavLink>
                    </li>
                    
                </div>
                :<></>
            }
        </navbar>
    )
    
}
