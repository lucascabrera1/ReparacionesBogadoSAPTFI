import express from 'express';
import router from './Routes/index.js'
import {connect} from './Connection.js'
import cors from 'cors'
import dotenv from 'dotenv'
//import verifyToken from './Middlewares/VerifyToken.js';
//import { requestContextMiddleware } from './Middlewares/request-context.js';

dotenv.config({path: '../.env'})

connect()

const app = express()
const port = process.env.PORT

//uses
//app.use(requestContextMiddleware)
//app.use(verifyToken)
app.use(cors())
app.use(express.json())
app.use('/', router)
app.set('appName', 'Reparaciones Bogado')

app.use((req, res, next) => {
    res.send("paso por la funcion app.use")
    console.log("paso por la funcion app.use")
    next()
})

app.listen(port, () =>{
    console.log(`aplicacion ${app.get('appName')} corriendo en localhost puerto ${port}`)
})

