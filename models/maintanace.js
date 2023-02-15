const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const MaintanceSchema = new mongoose.Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers"
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys"
    },
    endMonth: {
        type: Number,
        require: true,
    },
    startMonth: {
        type: Number,
        require: true,
        // enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    },
    amount: {
        type: Number,
        require: true,
    },
    year: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    isDefault: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
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
MaintanceSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Maintance = mongoose.model("msociety_maintances", MaintanceSchema);

module.exports = Maintance;