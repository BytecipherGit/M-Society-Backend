const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SocietySubscriptionSchema = new mongoose.Schema({
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
    endDateOfSub:{
        type: Date,
        default: null,
    },
    startDateOfSub:{
        type: Date,
        default: null,
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

const SocietySubscription = mongoose.model("msociety_SocietySubscriptions", SocietySubscriptionSchema);

module.exports = SocietySubscription;