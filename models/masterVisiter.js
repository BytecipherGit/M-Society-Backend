const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const MasterVisiterSchema = new mongoose.Schema({
    visiterId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers"
    },
    name: {
        type: String
    },
    guardId: {
        type: Schema.Types.ObjectId,
    },
    phone: {
        type: Number,
        require: true,
    },
    houseNumber: {
        type: Number,
        require: true,
    },
    reasone: {
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
MasterVisiterSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const MasterVisiter = mongoose.model("msociety_mastervisiters", MasterVisiterSchema);

module.exports = MasterVisiter;