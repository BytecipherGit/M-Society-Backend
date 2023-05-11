const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const SupportSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    userType: {
        type: String,
        enum: ["society admin", "service provider"],
    },
    type: {
        type: String,
        enum: ["chat", "email", "contact"],
    },
    chat: {
        type: Array,
    },
    status: {
        type: String,
        enum: ["pendting", "new", "inProgress", "resolved", "reopen",'open','close'],//"pending", "approve","rejecte",
        default: "open",
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
