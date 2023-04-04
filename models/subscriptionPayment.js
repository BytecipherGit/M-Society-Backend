const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SocietySubscriptionPaymentSchema = new mongoose.Schema({
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
    // endDateOfSub: {
    //     type: Date,
    //     default: null,
    // },
    // startDateOfSub: {
    //     type: Date,
    //     default: null,
    // },
    // status: {
    //     type: String,
    //     enum: ["active", "inactive"],
    //     default: "active",
    // },
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
    payment_method: {
        type: String,
        default: null
    },
    order_id: {
        type: String,
        default: null
    },
    // payment_method: {
    //     type: String,
    //     default: null
    // },
    payment_currency: {
        type: String,
        default: null
    },
    payment_status: {
        type: String,
        default: null
    },
    payment_time: {
        type: String,
        default: null
    },
    paymentObject:{
        type: Array,
        default: null
    }
});

const SocietySubscriptionPayment = mongoose.model("msociety_subscriptionspayment", SocietySubscriptionPaymentSchema);

module.exports = SocietySubscriptionPayment;