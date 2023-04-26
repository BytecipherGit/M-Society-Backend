const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const ViewCountSchema = new mongoose.Schema({
    singleCount: {
        type: Number,
        default: 0,
    },
    totalCount: {
        type: Number,
        default: 0,
    },
    userId: {
        // type: Array,
        type: [Schema.Types.ObjectId],
        ref: "msociety_residentialusers"
    },
    serviceProviderId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_serviceproviders"
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

ViewCountSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const ViewCount = mongoose.model("msociety_serviceviewcount", ViewCountSchema);

module.exports = ViewCount;