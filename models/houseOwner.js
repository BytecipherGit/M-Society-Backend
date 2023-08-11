const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        // require: true,
    },
    email: {
        type: String,
        // unique: true,
    },
    phoneNumber: {
        type: String,
        // require: true,
    },
    residentialUserId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    address: {
        type: String,
        // require: true,
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    houseNumber:{
        type: String,
        default: null
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
    deletedDate:{
        type: Date,
        default: null,
    },
    countryCode: {
        type: String,
    },
});

const HouseOwner = mongoose.model("msociety_houseowners", ownerSchema);

module.exports = HouseOwner;

