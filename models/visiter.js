const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const VisitorSchema = new mongoose.Schema({
    masterVisitorId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_mastervisiters"
    },
    name: {
        type: String
    },
    guardId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_guards"
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    phoneNumber: {
        type: Number,
        require: true,
    },
    countryCode: {
        type: String,
        default: "",
    },
    houseNumber: {
        type: String,
        require: true,
    },
    reasone: {
        type: String,
    },
    image: {
        type: String,
    },
    inTime: {
        type: String,
    },
    outTime: {
        type: String,
        default: "",
    },
    isApprove: {
        type: String,
        enum: ["approved", "deny", null ],
        default: null,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    date: {
        type: Date,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});
VisitorSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Visitor = mongoose.model("msociety_visitors", VisitorSchema);

module.exports = Visitor;
