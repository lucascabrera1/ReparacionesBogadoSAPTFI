import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, htmlContent) => {
    try {
        console.log("---------------------------------entra al componente sendEmail-------------------------")
        console.log("content html")
        console.log(htmlContent)
        console.log("fin content html")
        console.log("subject")
        console.log(subject)
        console.log("fin subject")
        console.log("email")
        console.log(email)
        console.log("fin email")
        console.log("----------------------------sale del componente sendEmail---------------")
        //console.log("link")
        //console.log(text)
        //console.log("fin link")
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            //service: process.env.SERVICE,
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
            tls : {
                rejectUnauthorized : false
            }
        });

        const result = await transporter.sendMail({
            from: "Reparaciones Bogado",
            to: email,
            subject: subject,
            //text: text,
            html : htmlContent
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