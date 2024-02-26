const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reportSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
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

const Report = mongoose.model("msociety_reports", reportSchema);

module.exports = Report;