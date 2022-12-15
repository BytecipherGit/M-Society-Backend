const superAdmin = require("../models/superAdmin");
const residentialUser = require("../models/residentialUser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { readFileSync } = require('fs');
// const nodemailer = require("nodemailer");

exports.makeUniqueAlphaNumeric = (length) => {
    var result = '';
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

exports.validateSuperAdmin = async (req) => {
    const userToken = req.headers.authorization;
    const token = userToken.split(" ");
    const decoded = jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET);
    if (decoded.user) {
        let user = await superAdmin.findOne({ "email": decoded.user });
        return user;
    }
};

exports.validateResidentialUser = async (req) => {
    const userToken = req.headers.authorization;
    const token = userToken.split(" ");
    const decoded = jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET);
    if (decoded.user) {
        let user = await residentialUser.findOne({ "phoneNumber": decoded.user, "isAdmin": '0' });
        return user;
    }
};

exports.validateSocietyAdmin = async (req) => {
    const userToken = req.headers.authorization;
    const token = userToken.split(" ");
    const decoded = jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET);
    if (decoded.user) {
        let user = await residentialUser.findOne({ "phoneNumber": decoded.user, "isAdmin": '1' });
        return user;
    }
};

exports.getLocaleMessages = () => {
    let language = 'en';
    /*if ( typeof authUser !== 'undefined' && authUser ) {
          const user = this.getAuthUserData();
          language = (user.language) ? user.language : 'en';
      }*/
    const data = readFileSync(__basedir + 'locales/' + language + '.json');
    return JSON.parse(data);
};

// exports.sendEmail = (data) => {
//     console.log(data);
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'darwadedaya882@gmail.com',
//             pass: 'kezrnelepasxzwzk'

//         }
//     });
//     var mailOptions = {
//         from: 'darwadedaya882@gmail.com',
//         to: data.email,//userEmail
//         subject: 'My Society Invitation',
//         // text: `'link':https://www.google.com/search?q=googlelink&oq=googlelink&aqs=chrome..69i57j0i10i512l5j0i10i30j0i10i15i30.5600j0j15&sourceid=chrome&ie=UTF-8
//         //        `,  
//         html: `<p>Otp: <b>${data.number}</b>`
//         // <p>Link: <b>https://www.google.com/search?q=googlelink&oq=googlelink&aqs=chrome..69i57j0i10i512l5j0i10i30j0i10i15i30.5600j0j15&sourceid=chrome&ie=UTF-8</b>`
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// };

exports.addHours = (numOfHours, date = new Date()) => {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
};