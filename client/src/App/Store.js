import {configureStore} from '@reduxjs/toolkit'
import ordenCompraSlice from '../Features/OrdenCompraSlice'
import RemitoSlice from '../Features/RemitoSlice'
import AuthSlice from '../Features/AuthSlice'
import UsersSlice from '../Features/UsersSlice'

export const store = configureStore ({
    reducer : {
        ordenesDeCompra: ordenCompraSlice,
        remitos : RemitoSlice,
        auth: AuthSlice,
        users: UsersSlice
    }
})