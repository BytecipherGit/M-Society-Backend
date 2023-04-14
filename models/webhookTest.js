const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const webhookTestSchema = new mongoose.Schema({
    resStatus: {
        type: Boolean,
        default: false,
    },
    bodyObject: {
        type: Array,
    }
});

const WebhookTest = mongoose.model("webhookTest", webhookTestSchema);

module.exports = WebhookTest;