const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const ServiceProviderSubscriptionSchema = new mongoose.Schema({
    serviceProviderId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_serviceproviders",
        require: true,
    },
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_subscriptions",
        require: true,
    },
    razorpaySubscriptionId: {
        type: String,
        default: null
    },
    razorpayPlanId: {
        type: String,
        default: null
    },
    razorpaySubscriptionIdStatus: {
        type: String,
        default: null
    },
    endDateOfSub: {
        type: Date,
        default: null,
    },
    startDateOfSub: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    // isDeleted: {
    //     type: Boolean,
    //     default: false,
    // },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

ServiceProviderSubscriptionSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});

const ServiceProviderSubscription = mongoose.model("msociety_serviceProvidersubscriptions", ServiceProviderSubscriptionSchema);

module.exports = ServiceProviderSubscription;