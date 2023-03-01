const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const VisiterSchema = new mongoose.Schema({
    masterVisiterId: {
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
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});
VisiterSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Visiter = mongoose.model("msociety_visiters", VisiterSchema);

module.exports = Visiter;
