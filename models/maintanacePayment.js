const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const MaintancePaymentSchema = new mongoose.Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers"
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers"
    },
    maintanceId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_maintances"
    },
    amount: {
        type: Number,
        require: true,
    },
    month: {
        type: Number,
    },
    year: {
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
    transactionId:{
        type: String,
    }
});
MaintancePaymentSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const MaintancePayment = mongoose.model("msociety_maintancespayment", MaintancePaymentSchema);

module.exports = MaintancePayment;