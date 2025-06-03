import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET
import { namespace, setUserId } from '../Utils/request-context.js'

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
        const namespacerun = namespace.run(() => {
            setUserId(decoded.id); // o el campo que uses
            next();
        })
        console.log(decoded)
        req.userId = decoded.id
        console.log("inicio namespacerun")
        console.log(namespacerun)
        console.log("fin namespacerun")
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