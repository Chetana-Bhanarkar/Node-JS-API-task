require('dotenv').config() ; 
let nodemailer = require('nodemailer');



const sendMail = async (email, mailSubject, Content) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL ,
                pass: process.env.SMTP_PASSWORD 
            }
        });

        var mailOptions = {
            from: process.env.USER_EMAIL ,
            to: email,
            subject: mailSubject,
            html: Content
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);

            } else {
                console.log('Mail Sent Successfully: ' + info.response);
            }
        });
    }
    catch(error){
        console.log(error.message);
    }
}


module.exports = {
    sendMail
}