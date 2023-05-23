const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const ServiceProviderSubscriptionPaymentSchema = new mongoose.Schema({
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
    token_id: {
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
    razorpayPlanId: {
        type: String,
        default: null
    },
    razorpaySubscriptionId: {
        type: String,
        default: null
    },
    razorpaySubscriptionStatus: {
        type: String,
        default: null
    },
    razorpaySubscriptionObject: {
        type: Array,
        default: null
    },
    razorpaySubscriptionCancelObject: {
        type: Array,
        default: null
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    payment_amount: {
        type: String,
        default: null
    },
    payment_method: {
        type: String,
        default: null
    },
    payment_time: {
        type: String,
        default: null
    },
    razorpayPaymentObject: {
        type: Array,
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

ServiceProviderSubscriptionPaymentSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});

const ServiceProviderSubscriptionPayment = mongoose.model("msociety_serviceprovidersubscriptionspayment", ServiceProviderSubscriptionPaymentSchema);

module.exports = ServiceProviderSubscriptionPayment;