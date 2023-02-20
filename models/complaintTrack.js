const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');
const complaintTrackSchema = new mongoose.Schema({
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys"
    },
    complainChat: {
        type: Array
    },
    complaintId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_complaints",
        require: true,
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

complaintTrackSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});

const ComplaintsTracks = mongoose.model("msociety_complaintstracks", complaintTrackSchema);

module.exports = ComplaintsTracks;
