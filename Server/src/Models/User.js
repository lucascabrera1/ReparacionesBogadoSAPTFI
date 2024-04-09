import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"

const schemaUser = new Schema({
    nombreUsuario: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    /* habilitado: {
        type: Boolean,
        required: true
    },
    autenticado: {
        type: String,
        required: true
    }, */
    roles: [{
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }]
}, {
    timestamps: true,
    versionKey: false
})

schemaUser.methods.encryptPassword = async (contraseña) => {
    const salt = await bcrypt.genSalt(4)
    return bcrypt.hash(contraseña, salt)
}

schemaUser.methods.validatePassword = function (contraseña) {
    console.log('inicio console log del modelo')
    console.log(contraseña, this.password)
    console.log('fin console log del modelo')
    return bcrypt.compare(contraseña, this.password)
}

export default model('User', schemaUser)