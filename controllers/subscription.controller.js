const subscription = require("../models/subscription");

exports.get = async (req, res) => {
    try {
        await subscription.find({ "deleted": false }).then(result => {
            return res.status(200).send({
                success: true,
                message: locale.id_fetched,
                data: result,
            });
        }).catch(err => {
            return res.status(400).send({
                success: false,
                message: locale.something_went_wrong,
                data: {},
            });
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
}

exports.getbyid = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                success: false,
                message: locale.enter_id,
                data: {},
            });
        }
        await subscription.findOne({ '_id': req.params.id }).then(result => {
            return res.status(200).send({
                success: true,
                message: locale.id_fetched,
                data: result,
            });
        }).catch(err => {
            return res.status(400).send({
                success: false,
                message: locale.something_went_wrong,
                data: {},
            });
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
}
exports.add = async (req, res) => {
    try {
        if (!req.body.name || !req.body.price || !req.body.duration) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let name = req.body.name;
        const firstLetterCap = await name.charAt(0).toUpperCase() + name.slice(1);
        let Subscription = await subscription.findOne({ price: req.body.price, "deleted": false });
        if (Subscription) {
            if (Subscription.price == req.body.price) {
                return res.status(400).send({
                    message: locale.sub_amt,
                    success: false,
                    data: {},
                })
            }
        }
        await subscription.create({
            name: firstLetterCap,
            status: req.body.status,
            price: req.body.price,
            duration: req.body.duration

        }).then(async data => {
            return res.status(200).send({
                message: locale.id_created,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.id_created_not,
                success: false,
                data: {},
            })
        })
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.updatesubscription = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        await subscription.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                status: req.body.status,
                price: req.body.price,
                duration: req.body.duration
            }
        }
        ).then(async result => {
            let data = await subscription.findOne({ "_id": req.body.id });
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {},
                })
            }
            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.valide_id_not,
                success: false,
                data: {},
            })
        })
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await subscription.destroy({
            "_id": req.body.id,
            // }, 
            // {
            //     $set: {
            //         isDeleted: true
            // }
        }).then(async data => {
            // if (data.deletedCount == 0) {
            //     return res.status(200).send({
            //         message: locale.valide_id_not,
            //         success: true,
            //         data: {},
            //     })
            // } else {
            return res.status(200).send({
                message: locale.id_deleted,
                success: true,
                data: {},
            })
            // }

        }).catch(err => {
            return res.status(400).send({
                message: locale.valide_id_not,
                success: false,
                data: {},
            })
        })
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};