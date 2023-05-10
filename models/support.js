const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const SupportSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        // ref: "msociety_mastervisiters"
    },
    userType: {
        type: String,
        enum: ["society admin", "service provider"],
        // default: "new",
    },
    type: {
        type: String,
        enum: ["chat", "email", "contact"],
        // default: "new",
    },
    chat: {
        type: Array,
        // item: Object
    },
    status: {
        type: String,
        enum: ["pendting", "new", "inProgress", "resolved", "reopen"],//"pending", "approve","rejecte",
        default: "new",
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
SupportSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Support = mongoose.model("msociety_supports", SupportSchema);

module.exports = Support;
