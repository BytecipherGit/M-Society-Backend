const mongoose = require("mongoose");
const phoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        // unique: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    profession: {
        type: String,
        require: true,
    },
    // societyId: {
    //     type: String,
    //     // require: true,
    // },
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

const phoneBook = mongoose.model("phonebooks", phoneBookSchema);

module.exports = phoneBook;

