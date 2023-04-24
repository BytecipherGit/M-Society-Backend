const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const commsSetSchema = new mongoose.Schema({
    paymentRemainderBeforedays: {
        type: Number,
        default:7
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

commsSetSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const commsStg = mongoose.model("msociety_commsStg", commsSetSchema);

module.exports = commsStg;

