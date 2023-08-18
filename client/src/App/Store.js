import {configureStore} from '@reduxjs/toolkit'
import ordenCompraSlice from '../Features/OrdenCompraSlice'

export const store = configureStore ({
    reducer : {
        ordenesDeCompra: ordenCompraSlice
    }
})