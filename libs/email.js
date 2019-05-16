const nodemailer = require('nodemailer');

class Mailer{
    send(to, subject, html){
        const transporter = nodemailer.createTransport(config.email);

        let mailOptions = {
            from   : '"Task Manager OFS"',
            to     : to,
            subject: subject,
            html   : html
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }
     
}

module.exports = new Mailer();