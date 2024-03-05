import {configureStore} from '@reduxjs/toolkit'
import ordenCompraSlice from '../Features/OrdenCompraSlice'
import RemitoSlice from '../Features/RemitoSlice'

export const store = configureStore ({
    reducer : {
        ordenesDeCompra: ordenCompraSlice,
        remitos : RemitoSlice
    }
})