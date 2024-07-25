import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            //service: process.env.SERVICE,
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        const result = await transporter.sendMail({
            from: "haga click en el siguiente link para recuperar la contraseña olvidada <process.env.USER>",
            to: email,
            subject: subject,
            text: text,
        });
        /* console.log("resultado")
        console.log(result)
        console.log("fin resultado") */
        console.log("email sent sucessfully");
        return result
    } catch (error) {
        console.log(error, "email not sent");
        return error
    }
};

export default { sendEmail }