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
    },
    password: {
        type: String,
        require: true,
    },
    otp: {
        type: String
    },
    status: {
        type: String,
        enum: ["active", "Inactive"],
        default: "Inactive",
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