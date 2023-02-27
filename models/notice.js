const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noticeSchema = new mongoose.Schema({
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    societyAdminId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    title: {
        type: String,
        // require: true,
    },
    description: {
        type: String,
        // require: true,
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
    attachedFile: {
        type: String,
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

const Notice = mongoose.model("msociety_notices", noticeSchema);

module.exports = Notice;

