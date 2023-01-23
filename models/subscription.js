const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    duration: {
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

const Subscription = mongoose.model("msociety_subscriptions", SubscriptionSchema);

module.exports = Subscription;