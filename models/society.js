const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SocietySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    registrationNumber: {
        type: String,
        require: true,
    },
    uniqueId: {
        type: String,
        require: true,
    },
    pin: {
        type: String,
        require: true,
    },
    societyAdimId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers"
    },
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_SocietySubscriptions"
    },
    subscriptionType: {
        type: String
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number,
    },
    images: {
        type: Array,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        default: null,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    isVerify:{
        type: Boolean,
        default: true
    }
});

const Society = mongoose.model("msociety_societys", SocietySchema);

module.exports = Society;