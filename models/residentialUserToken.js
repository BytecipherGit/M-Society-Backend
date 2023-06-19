const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ResidentialUserTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    userType: {
        type: String,
        default: null
    },
    deviceToken: {
        type: String,
        default: null,
    },
    tokenExpireAt: {
        type: String,
        default: null,
    },
    deviceType: {
        type: String,
        default: null,
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
});

const ResidentialUserToken = mongoose.model("msociety_residentialuserstoken", ResidentialUserTokenSchema);

module.exports = ResidentialUserToken;
