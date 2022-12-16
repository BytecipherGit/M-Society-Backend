const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    // host: process.env.MAIL_HOST,
    // port: process.env.MAIL_PORT,
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERANAME,
        pass: process.env.MAIL_PASSWORD
    }
});

exports.sendEmail = (req,res,message) => {
    console.log(req.body);
    console.log(message);
    message = {
        from: process.env.MAIL_FROM,
        to: req.body.email,
        subject: req.body.subject,
        text: message
    };
    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
};
