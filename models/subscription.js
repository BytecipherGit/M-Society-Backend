const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const SubscriptionSchema = new mongoose.Schema({
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
    razoPlanId: {
        type: String,
    },
    uniqueId: {
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

SubscriptionSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Subscription = mongoose.model("msociety_subscriptions", SubscriptionSchema);

module.exports = Subscription;