const mongoose = require("mongoose");
const noticeSchema = new mongoose.Schema({
    societyId: {
        type: String,
        require: true,
    },
    societyAdminId: {
        type: String,
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

const Notice = mongoose.model("notices", noticeSchema);

module.exports = Notice;

