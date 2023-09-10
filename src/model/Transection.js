const mongoose = require('mongoose');
const TransectionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
        },
        status: { type: String },


    },
    {
        timestamps: true
    }
)
const Transection = mongoose.model("Transection", TransectionSchema);
module.exports = Transection;