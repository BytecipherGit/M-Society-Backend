const helper = require("../helpers/helper");
const Support = require("../models/support");

exports.add = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        req.body.userId = user._id
        req.body.userType = 'society'
        let data = await Support.create(req.body);
        return res.status(200).send({
            success: true,
            message: locale.id_created,
            data: data
        })
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {}
        })
    }
};

exports.fetch = (req, res) => {
    try {
        return res.status(200).send({
            success: true,
            message: locale,
            data: {}
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale,
            data: {}
        })
    }
}

exports.fetchAll = (req, res) => {
    try {
        return res.status(200).send({
            success: true,
            message: locale,
            data: {}
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale,
            data: {}
        })
    }
};

exports.delete = (req, res) => {
    try {
        return res.status(200).send({
            success: true,
            message: locale,
            data: {}
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale,
            data: {}
        })
    }
};

exports.update = (req, res) => {
    try {
        return res.status(200).send({
            success: true,
            message: locale,
            data: {}
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale,
            data: {}
        })
    }
}