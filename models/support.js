const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');


// Create Schema
const messages = new mongoose.Schema({
    text: {
        type: String,
    },
    subject: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String
    }
})


const SupportSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    userType: {
        type: String,
        enum: ["society", "service provider"],
    },
    type: {
        type: String,
        enum: ["chat", "email", "contact"],
    },
    chat: {
        // type: Array,
        type: [messages]
    },
    status: {
        type: String,
        enum: ["pendting", "new", "inProgress", "resolved", "reopen", 'open', 'close'],//"pending", "approve","rejecte",
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
