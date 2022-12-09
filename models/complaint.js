const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
    societyId: {
        type: String,
        require: true,
    },
    residentUserId: {
        type: String,
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
        enum: ["active", "Inactive"],
        default: "Inactive",
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

const Complaints = mongoose.model("complaints", complaintSchema);

module.exports = Complaints;

