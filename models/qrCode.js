const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const qrCodeSchema = new mongoose.Schema({
    qrCode: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: "active",
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    // service: {
    //     type: Boolean,
    //     default: false
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
qrCodeSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const qrCode = mongoose.model("msociety_qrcodes", qrCodeSchema);

module.exports = qrCode;