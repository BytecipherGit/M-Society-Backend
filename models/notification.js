const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'msociety_residentialusers' 
    },
    userType: {
        type: String,
        default: null,
    },
    payload: {
        type: Object,
        default: null,
    },
    topic: {
        type: String,
        default: null,
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
notificationSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Notification = mongoose.model("msociety_notifications", notificationSchema);

module.exports = Notification;