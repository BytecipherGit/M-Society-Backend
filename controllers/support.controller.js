const helper = require("../helpers/helper");
const Support = require("../models/support");
const SuperAdmin = require("../models/superAdmin");
const ServiceProvider = require("../models/serviceProvider");
const Admin = require("../models/residentialUser");
const Society = require("../models/society");

exports.add = async (req, res) => {
    try {
        if (!req.body.type || !req.body.userId || !req.body.chat) {
            return res.status(200).send({
                success: true,
                message: locale.enter_id,
                data: {}
            })
        }
        let society = await Society.findOne({ '_id': req.body.userId });
        if (society) req.body.chat.replyUserType = "society";

        let serviceProvide = await ServiceProvider.findOne({ '_id': req.body.userId });
        if (serviceProvide) req.body.chat.replyUserType = "service provider";

        req.body.userId = req.body.userId
        req.body.userType = req.body.chat.replyUserType

        if (!req.file) {
            req.body.chat.image = "";
        } else req.body.chat.image = req.file.filename;

        let data = await Support.create(req.body);
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

exports.reply = async (req, res) => {
    try {
        if (!req.body.id || !req.body.userId || !req.body.chat) {
            return res.status(200).send({
                success: true,
                message: locale.enter_id,
                data: {}
            })
        }
        let supAdmin = await SuperAdmin.findOne({ '_id': req.body.userId });
        if (supAdmin) req.body.chat.replyUserType = "super admin";

        let society = await Society.findOne({ '_id': req.body.userId });
        if (society) req.body.chat.replyUserType = "society";

        let serviceProvide = await ServiceProvider.findOne({ '_id': req.body.userId });
        if (serviceProvide) req.body.chat.replyUserType = "service provide";

        if (!req.file) {
            req.body.chat.image = "";
        } else req.body.chat.image = req.file.filename;

        await Support.updateOne({ '_id': req.body.id }, {
            $push: { chat: req.body.chat }, status: req.body.status
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
        let doc = await Support.findOne({ "_id": req.params.id });
        for (let i = 0; i < doc.chat.length; i++) {
            if (doc.chat[i].image) {
                doc.chat[i].image = process.env.API_URL + "/" + doc.chat[i].image
            }
        }
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
            data: doc
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
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 2;
        var query = { "deleted": false };
        let data = await Support.find(query).sort({ createdDate: -1 }).limit(limit).skip(page * limit);
        let totalData = await Support.find(query);
        let count = totalData.length
        let page1 = count / limit;
        let page3 = Math.ceil(page1);
        for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < data[j].chat.length; i++) {
                if (data[j].chat[i].image) data[j].chat[i].image = process.env.API_URL + "/" + data[j].chat[i].image
            }
        }
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
            data: data,
            totalPages: page3,
            count: count,
            perPageData: limit
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {}
        })
    }
};


exports.fetchAllByUser = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 2;
        var query = { "deleted": false, 'userId': req.params.id };
        let data = await Support.find(query).sort({ createdDate: -1 }).limit(limit).skip(page * limit);
        let totalData = await Support.find(query);
        let count = totalData.length
        let page1 = count / limit;
        let page3 = Math.ceil(page1);
        for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < data[j].chat.length; i++) {
                if (data[j].chat[i].image) data[j].chat[i].image = process.env.API_URL + "/" + data[j].chat[i].image
            }
        }
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
            data: data,
            totalPages: page3,
            count: count,
            perPageData: limit
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
        if (!req.params.id) {
            return res.status(200).send({
                success: true,
                message: locale.enter_id,
                data: {}
            })
        }
        await Support.destroy({ "_id": req.params.id });
        return res.status(200).send({
            success: true,
            message: locale.id_deleted,
            data: {}
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {}
        })
    }
};
