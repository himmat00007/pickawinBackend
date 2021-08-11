var nodemailer = require('nodemailer')
const sendEmail = (to, subject, message, from = null, callback) => {
    console.log(to, subject, message, from = null, callback)
    var mailConfig = {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: process.env['SENDGRID_API'],
            pass: process.env['SENDGRID_API_KEY']
        }
    };
    var mailOptions = {
        from: 'motivateyou78@gmail.com',
        to: to,
        subject: subject,
        html: message
    };
    let transporter = nodemailer.createTransport(mailConfig);
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions)
            .then((info) => {
                console.log(info)
                resolve(true, info)
            })
            .catch((err) => {
                console.log(err)

                resolve(false, err)
            })
    })
}
module.exports = { sendEmail }