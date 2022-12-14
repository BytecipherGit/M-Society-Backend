const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const documentationSchema = new mongoose.Schema({
    societyAdminId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    documentName: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        // require: true,
    },
    documentImageFile: {
        type: String,
        // require: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
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

const Documentation = mongoose.model("msociety_documentations", documentationSchema);

module.exports = Documentation;