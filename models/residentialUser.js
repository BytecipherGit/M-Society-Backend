const mongoose = require("mongoose");
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
        type: String,
        // require: true,
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
        type: String,
        // require: true,
    },
    is_admin: {//isAdmin
        type: String,
        enum: ["1", "2" ,"0"],//1 == admin 2 == sub admin
        default: "0",
    },
    occupation: {
        type: String,
    },
    profileImage:{
        type:String
    },
    userType: {
        type: String,
        enum: ["rental", "owner"],//hire
        default: "owner",
    },
    status: {
        type: String,
        enum: ["active", "Inactive"],
        default: "Inactive",
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

const ResidentialUser = mongoose.model("residentialusers", ResidentialUserSchema);

module.exports = ResidentialUser;
