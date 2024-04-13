import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"

let schemaUser = new Schema({
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

schemaUser.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(4)
    return bcrypt.hash(password, salt)
}

schemaUser.methods.validatePassword = function (password) {
    console.log('inicio console log del modelo')
    console.log(password, this.password)
    console.log('fin console log del modelo')
    return bcrypt.compare(password, this.password)
}

export default model('User', schemaUser)