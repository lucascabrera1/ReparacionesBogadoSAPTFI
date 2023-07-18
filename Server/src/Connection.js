import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})

mongoose.set('strictQuery', true)
//el strict query estaba en principio en true

const uri = process.env.URI_DB 
    ? process.env.URI_DB 
    : 'mongodb://127.0.0.1:27017/yourdb'
    
const db = mongoose.connection

export async function connect(){
    try {
        console.log(uri)
        const db = await mongoose.connect(uri)
        console.log("connected with ", db.connection.name)
    } catch (error) {
        console.error("error de conexión")
        console.error(error)
    }
}

db.once('open', _ => {
    console.log("database connected with: " + uri)
})

db.on('error', err => {
    console.error(err.reason)
})