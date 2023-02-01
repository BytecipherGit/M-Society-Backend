const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const documentSchema = new mongoose.Schema({
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
        enum: ["draft", "publish"],
        default: "draft",
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

const Document = mongoose.model("msociety_documents", documentSchema);

module.exports = Document;