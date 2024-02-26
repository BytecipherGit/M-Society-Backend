const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const GuardAttendanceSchema = new mongoose.Schema({
    guardId: {
        type: String,
        require: true,
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    date: {
        type: Date,
    },
    inTime:{
        type: Date,
    },
    outTime:{
        type: Date,
        default:null
    },
    verifyAttendance: {
        type: String,
        enum: ["0", "1"],
        default: "0",
    },
    qrCode:{
        type: String,
        default:null
    },
    // status: {
    //     type: String,
    //     enum: ["in", "out", null],
    //     default: null,
    // },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },

});

GuardAttendanceSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const GuardAttendance = mongoose.model("msociety_guardattendances", GuardAttendanceSchema);

module.exports = GuardAttendance;
