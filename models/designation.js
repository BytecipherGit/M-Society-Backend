const mongoose = require("mongoose");
const designationSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        enum: ["active", "Inactive"],
        default: "Inactive",
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

const Designation = mongoose.model("designations", designationSchema);

module.exports = Designation;