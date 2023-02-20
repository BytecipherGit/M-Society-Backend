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

exports.sendEmail = (req, res, message) => {
    if (req.body.password) {
        message = {
            from: process.env.MAIL_FROM,
            to: req.body.email,
            subject: req.body.subject,
            // text: message,Know you login with this credential
            html: `<img weight:"20%" src='http://43.231.127.169:9004/static/media/logo.8c16e418535169f4f36e.png'> <h2>Welcome In M-society</h2><h4>Know you login with this credential :</h4><b> Phone Number : ${req.body.phone} <br>  Password : ${req.body.password}</b> <br><h4> From this Link : ${'http://43.231.127.169:9004/society-admin'} </h4>`
        };
    } else {
        message = {
            from: process.env.MAIL_FROM,
            to: req.body.email,
            subject: req.body.subject,
            // text: message,
            // html: { path: "/Users/apple/Desktop/Jaya/Msociety/BACKEND/M-Society-Backend/view/otp/otpSend.html" }
            //  html: { path: "../.././view/otp/otpSend.html" }
            html: `<h2>Hello from M-society</h2><h4>Your OTP for Password Update :</h4><b>${otp}</b>`
        };
    }
    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log("err", err)
        } else {
            console.log(info);
        }
    });
};
