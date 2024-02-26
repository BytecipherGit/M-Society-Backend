const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const block = new mongoose.Schema({
    societyId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'msociety_societys'
    },
    status: {
        type: String,
        default: null,
    },
    reason: {
        type: String,
        enum: ["apply", "blocked",null],
        default: null,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

const serviceProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        // unique: true,
    },
    address: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        // unique: true,
    },
    password: {
        type: String,
        default: null,
    },
    serviceName: {
        type: String,
        require: true,
    },
    images: {
        type: Array
    },
    videos: {
        type: Array
    },
    rating: {
        type: String,
        default: null,
    },
    societyId: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'msociety_societys' },
    ],
    blockSocietyId: {
        type: [block],
        default: [],
    },
    cityName: {
        type: Array
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number,
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
    country: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    countryCode: {
        type: String,
        require: true,
    },
    isVerify: {
        type: Boolean,
        require: true,
        require: false
    },
    profileImage: {
        type: String,
        default: null,
    },
    idProof: {
        type: String,
        default: null,
    },
    idProofType: {
        type: String,
        default: null,
    },
    otherPhoneNumber: {
        type: Array,
    },
    verifyDate: {
        type: Date,
        default: null
    },
    webUrl: {
        type: String,
    },
    otp: {
        type: String
    },
    otpCount: {
        type: Number,
        default: 0
    },
    otpDate: {
        type: Date,
        default: Date.now,
    },
    verifyOtp: {
        type: String,
        enum: ["0", "1"],
        default: "1",
    },
    viewCount: {
        type: Number,
        default: 0
    },
    subscriptionId: {
        type: String,
        default: null
    },
    subscriptionType: {
        type: String,
        default: null
    },
});

serviceProviderSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});

const serviceProvider = mongoose.model("msociety_serviceproviders", serviceProviderSchema);

module.exports = serviceProvider;

