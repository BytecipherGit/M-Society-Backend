const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    type: {
        type: String,
    },
    razoPlanId:{
        type: String,
    },
    // stateCount: {
    //     type: Number,
    // },
    // cityCount: {
    //     type: Number,
    // },
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

ServiceSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Service = mongoose.model("msociety_servicesubscriptions", ServiceSchema);

module.exports = Service;