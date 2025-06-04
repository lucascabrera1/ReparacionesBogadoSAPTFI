import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET
import { setUserId } from '../Utils/request-context.js'

function verifyToken  (req, res, next)  {
    const bearer = req.headers["authorization"]
    if (!bearer) {
        return res.status(401).json({
            auth: false,
            message: "no token provided"
        })
    }
    const token = bearer.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: "no token provided"
        })
    }
    try {
        const decoded = jwt.verify(token, stoken)
        setUserId(decoded.id); // o el campo que uses
        console.log(decoded)
        req.userId = decoded.id
        next();
    } catch (error) {
        res.status(400).json({
            auth: false,
            message: "invalid token"
        })
        console.error(error.message)
    }
    
}

export default verifyToken