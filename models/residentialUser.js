const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ResidentialUserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    email: {
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
        require: true,
    },
    designationId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_designations",
        require: true,
    },
    houseNumber: {
        type: String,
        // require: true,
    },
    societyUniqueId: {
        type: String,
        // require: true,
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    is_admin: {//isAdmin
        type: String,
        enum: ["1", "2", "0"],//1 == admin 2 == sub admin
        default: "0",
    },
    occupation: {
        type: String,
    },
    otp: {
        type: String
    },
    profileImage: {
        type: String
    },
    userType: {
        type: String,
        enum: ["rental", "owner"],//hire
        default: "owner",
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
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

const ResidentialUser = mongoose.model("msociety_residentialusers", ResidentialUserSchema);

module.exports = ResidentialUser;
