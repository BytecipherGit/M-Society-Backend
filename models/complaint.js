const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const complaintSchema = new mongoose.Schema({
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    residentUserId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    complainTitle: {
        type: String,
        // require: true,
    },
    applicantName: {
        type: String,
        // require: true,
    },
    phoneNumber: {
        type: String,
        // require: true,
    },
    description: {
        type: String,
        // require: true,
    },
    attachedImage: {
        type: String
    },
    status: {
        type: String,
        enum: ["cancel", "new", "inprogress", "resolved", "reopen"],//"pending", "approve","rejecte",
        default: "new",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    countryCode: {
        type: String,
    },
});

const Complaints = mongoose.model("msociety_complaints", complaintSchema);

module.exports = Complaints;

