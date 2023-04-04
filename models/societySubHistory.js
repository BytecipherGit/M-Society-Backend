const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const SocietySubscriptionHistorySchema = new mongoose.Schema({
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_subscriptions",
        require: true,
    },
    endDate: {
        type: Date,
        default: null,
    },
    startDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    isLast: {
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

SocietySubscriptionHistorySchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});

const SocietySubscriptionHistory = mongoose.model("msociety_SocietySubscriptionHistorys", SocietySubscriptionHistorySchema);

module.exports = SocietySubscriptionHistory;