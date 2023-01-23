const subscription = require("../models/subscription");

exports.get = async (req, res) => {
    try {
        await subscription.find({ "status": "active", "isDeleted": false }).then(result => {
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
