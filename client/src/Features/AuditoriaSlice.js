import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialstate = {
    auditorias : [],
    estadoauditorias : "idle",
    erroresauditorias : ""
}