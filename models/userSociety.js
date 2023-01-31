const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const UserSocietySchema = new mongoose.Schema({
    societyId: {
        type: String,
        require: true,
    },
    userId: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    isDefault: {
        type: Boolean,
        // default: false,
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
UserSocietySchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const UserSociety = mongoose.model("msociety_usersocietys", UserSocietySchema);

module.exports = UserSociety;