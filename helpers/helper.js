const superAdmin = require("../models/superAdmin");
const residentialUser = require("../models/residentialUser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { readFileSync } = require('fs');

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

exports.addHours = (numOfHours, date = new Date()) => {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
};