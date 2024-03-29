const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SuperAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    otp: {
        type: String
    },
    // profession: {
    //     type: String
    // },
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
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
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

const SuperAdmin = mongoose.model("msociety_superadmins", SuperAdminSchema);

module.exports = SuperAdmin;