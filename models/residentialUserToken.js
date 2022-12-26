const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ResidentialUserTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,

    },
    refreshToken: {
        type: String,

    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    deviceToken: {
        type: String,
    },
    tokenExpireAt: {
        type: String,
    },
    deviceType: {
        type: String,
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
