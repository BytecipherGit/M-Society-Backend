const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSoftDelete = require('soft-delete-mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    serviceProviderId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_serviceproviders",
        require: true,
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        // require: true,
    },
    comment: {
        type: String,
        default: null,
    },
    rating: {
        type: Number,
        default: null,
    },
    type: {
        type: String,
        enum: ["rating", "report"],
        default: "rating",
    },
    title: {
        type: String,
        // enum: ["rating", "report"],
        default: "rating",
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
CommentSchema.plugin(mongooseSoftDelete, {
    paranoid: true,
});
const Comment = mongoose.model("msociety_comments", CommentSchema);

module.exports = Comment;