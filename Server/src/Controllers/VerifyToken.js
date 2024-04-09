import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const stoken = process.env.SECRET

function verifyToken  (req, res, next)  {
    //const bearer = req.headers['authorization'];
    //const token = bearer.split(' ')[1]
    const token = req.headers['x-access-token']
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