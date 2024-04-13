import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET

function verifyToken  (req, res, next)  {
    //const bearer = req.headers['x-access-token'];
    //const token = bearer.split(' ')[1]
    console.log("llega al verify token")
    const bearer = req.headers["authorization"]
    console.log("bearer de req.headers['authorization']")
    console.log(req.headers)
    console.log(bearer)
    const token = bearer.split(' ')[1]
    console.log("pasa por el verify token")
    console.log(token)
    console.log("arriba muestra el token")
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: "no token provided"
        })
    }
    try {
        console.log(req.body)
        const decoded = jwt.verify(token, stoken)
        console.log(decoded)
        req.userId = decoded.id
        console.log(req.userId)
        console.log("pasa exitosamente el verify token")
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