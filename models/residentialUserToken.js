const mongoose = require("mongoose");
const ResidentialUserTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,

    },
    refreshToken: {
        type: String,

    },
    accountId: {
        type: String,
    },
    // deviceToken: {
    //     type: String,
    // },
    // tokenExpireAt: {
    //     type: String,
    // },
    remark: {
        type: String,
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

const ResidentialUserToken = mongoose.model("residentialuserstoken", ResidentialUserTokenSchema);

module.exports = ResidentialUserToken;

