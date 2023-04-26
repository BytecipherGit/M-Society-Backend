const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const contentSchema = new mongoose.Schema({
    FAQ: {
        type: String
    },
    TC: {
        type: String
    },
    privecyPolicy: {
        type: String,
    },
    aboutUs: {
        type: String,       
    },
    serviceFAQ: {
        type: String
    },
    serviceTC: {
        type: String
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

contentSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Content = mongoose.model("msociety_contents", contentSchema);

module.exports = Content