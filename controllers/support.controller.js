const helper = require("../helpers/helper");
const Support = require("../models/support");
const SuperAdmin = require("../models/superAdmin");
const ServiceProvider = require("../models/serviceProvider");
const Admin = require("../models/residentialUser");

exports.add = async (req, res) => {
    try {
        // let user = await helper.validateSocietyAdmin(req);
        if (!req.body.type || !req.body.userId || !req.body.chat) {
            return res.status(200).send({
                success: true,
                message: locale.enter_id,
                data: {}
            })
        }
        let societyAdimn = await Admin.findOne({ '_id': req.body.userId });
        if (societyAdimn) req.body.chat.replyUserType = "society admin";

        let serviceProvide = await ServiceProvider.findOne({ '_id': req.body.userId });
        if (serviceProvide) req.body.chat.replyUserType = "service provider";

        req.body.userId = req.body.userId
        req.body.userType = req.body.chat.replyUserType
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

exports.reply = async (req, res) => {
    try {
        // let user = await helper.validateSocietyAdmin(req);
        if (!req.body.id || !req.body.userId || !req.body.chat) {
            return res.status(200).send({
                success: true,
                message: locale.enter_id,
                data: {}
            })
        }
        let supAdmin = await SuperAdmin.findOne({ '_id': req.body.userId });
        if (supAdmin) req.body.chat.replyUserType = "super admin";

        let societyAdimn = await Admin.findOne({ '_id': req.body.userId });
        if (societyAdimn) req.body.chat.replyUserType = "society admin";

        let serviceProvide = await ServiceProvider.findOne({ '_id': req.body.userId });
        if (serviceProvide) req.body.chat.replyUserType = "service provide";

        await Support.updateOne({ '_id': req.body.id }, {
            $push: { chat: req.body.chat }
        });
        let data = await Support.findOne({ "_id": req.body.id });
        return res.status(200).send({
            success: true,
            message: locale.id_created,
            data: data
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {}
        })
    }
};

exports.fetch = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                success: true,
                message: locale.enter_id,
                data: {}
            })
        }
        let data = await Support.findOne({ "_id": req.params.id });
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
            data: data
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {}
        })
    }
}

exports.fetchAll = async (req, res) => {
    try {
        let data = await Support.find({ "deleted": false });
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
            data: data
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {}
        })
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                success: true,
                message: locale.enter_id,
                data: {}
            })
        }
        let data = await Support.destroy({ "_id": req.body.id });
        return res.status(200).send({
            success: true,
            message: locale.id_deleted,
            data: data
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
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
            message: locale.something_went_wrong,
            data: {}
        })
    }
}