const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const phoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        // require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        // unique: true,
    },
    profession: {
        type: String,
        require: true,
    },
    societyAdminId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
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

const phoneBook = mongoose.model("msociety_phonebooks", phoneBookSchema);

module.exports = phoneBook;

