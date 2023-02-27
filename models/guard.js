const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const GuardSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    shift: {
        type: String,
        enum: ["day", "night"],
        default: "day",
    },
    dob: {
        type: Date,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
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
    profileImage: {
        type: String
    },
    idProof: {
        type: String
    },
    status: {
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
    countryCode: {
        type: String,
    },
    joiningDate:{
        type: Date,
    }
});

GuardSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Guard = mongoose.model("msociety_guards", GuardSchema);

module.exports = Guard;
