const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const professionSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
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
professionSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Profession = mongoose.model("msociety_professions", professionSchema);

module.exports = Profession;