const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const MasterVisitorSchema = new mongoose.Schema({
    visitorId: {
        type: Array,
        ref: "msociety_residentialusers"
    },
    visitorCount: {
        type: Number,
        require: true,
        default: 0
    },
    name: {
        type: String
    },
    guardId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_guards"
    },
    phoneNumber: {
        type: Number,
        require: true,
    },
    countryCode: {
        type: String,
        require: true,
    },
    image: {
        type: String,
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
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
MasterVisitorSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const MasterVisitor = mongoose.model("msociety_mastervisitors", MasterVisitorSchema);

module.exports = MasterVisitor;
