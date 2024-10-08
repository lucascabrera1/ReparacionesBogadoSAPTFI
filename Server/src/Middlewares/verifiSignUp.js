import Role from "../Models/Role.js"
import User from "../Models/User.js"

export const checkRoles = async (req, res, next) => {
    let ROLES = []
    const rolesEncontrados = await Role.find({})
    rolesEncontrados.map( rol => {
        ROLES.push(rol.nombre)
    })
    if (req.body.roles) {
        for (let i=0; i<req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).json({
                    message: `El rol ${req.body.roles[i]} no existe`
                })
            }
        }
    }
    next()
}

export const CheckDuplicateUser = async (req, res, next) => {
    const {email, nombreUsuario} = req.body
    const userFoundedByName = await User.findOne({nombreUsuario})
    if (userFoundedByName && userFoundedByName._id.toString() !== req.params.id)  return res.status(400).json({
        error: true,
        message: `User ${nombreUsuario} founded by nombreUsuario already exists`
    })
    const userFoundedByMail = await User.findOne({email})
    if (userFoundedByMail && userFoundedByMail._id.toString() !== req.params.id) return res.status(400).json({
        error: true,
        message: `User ${email} founded by Mail already exists`
    })
    next()
}