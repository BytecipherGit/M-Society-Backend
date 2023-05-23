const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const phoneLengthSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    iso3: {
        type: String,
        default: null
    },
    iso2: {
        type: String,
        default: null
    },
    phone_code: {
        type: String,
        default: null
    },
    emoji: {
        type: String,
        default: null
    },
    emoji_code: {
        type: String,
        default: null
    },
    phone_length: {
        type: String,
        default: null
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

phoneLengthSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const phoneLength = mongoose.model("CountryCode", phoneLengthSchema);

module.exports = phoneLength;

