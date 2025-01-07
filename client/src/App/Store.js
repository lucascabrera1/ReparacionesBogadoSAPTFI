import {configureStore} from '@reduxjs/toolkit'
import ordenCompraSlice from '../Features/OrdenCompraSlice'
import RemitoSlice from '../Features/RemitoSlice'
import AuthSlice from '../Features/AuthSlice'
import UsersSlice from '../Features/UsersSlice'
import VentaSlice from '../Features/VentaSlice'

export const store = configureStore ({
    reducer : {
        ordenesDeCompra: ordenCompraSlice,
        remitos : RemitoSlice,
        auth: AuthSlice,
        users: UsersSlice,
        ventas: VentaSlice
    }
    //+ window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})