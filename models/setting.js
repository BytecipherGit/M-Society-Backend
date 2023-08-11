
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const SettingSchema = new mongoose.Schema({
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys"
    },
    guardApproveSetting: {
        type: Boolean,
        default: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

SettingSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Setting = mongoose.model("msociety_setting", SettingSchema);

module.exports = Setting;
