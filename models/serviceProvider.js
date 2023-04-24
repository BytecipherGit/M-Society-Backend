const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
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
    societyId: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'msociety_societys' },
   ],
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
        // require: true,
    },
    state: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    countryCode:{
        type: String,
        require: true,
    },
    isVerify:{
        type:Boolean,
        require: true,
        require:false
    },
    profileImage: {
        type: String,
        // require: true,
    },
    idProof: {
        type: String,
        // require: true,
        // unique: true,
    },
    idProofType: {
        type: String,
        // require: true,
    },
    otherPhoneNumber:{
        type: Array,
    },
    verifyDate: {
        type: Date,
        default:null
    },
    webUrl:{
        type: String,
    }
});

serviceProviderSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});

const serviceProvider = mongoose.model("msociety_serviceproviders", serviceProviderSchema);

module.exports = serviceProvider;

