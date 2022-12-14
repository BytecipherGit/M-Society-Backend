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
    status: {
        type: String,
        enum: ["pending", "approve","rejecte"],
        default: "pending",
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
});

const Complaints = mongoose.model("msociety_complaints", complaintSchema);

module.exports = Complaints;

