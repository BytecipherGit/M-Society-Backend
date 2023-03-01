const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const MasterVisiterSchema = new mongoose.Schema({
    visiterId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        default: []
    },
    visiterCount: {
        type: Number,
        require: true,
        default:0
    },
    name: {
        type: String
    },
    guardId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_guards"
    },
    phoneNumber: {
        type: Number,
        require: true,
    },
    countryCode: {
        type: String,
        require: true,
    },
    houseNumber: {
        type: Number,
        require: true,
    },
    reasone: {
        type: String,
    },
    image: {
        type: String,
    },
    time: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
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
MasterVisiterSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const MasterVisiter = mongoose.model("msociety_mastervisiters", MasterVisiterSchema);

module.exports = MasterVisiter;
