const mongoose = require('mongoose');
const PlanSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        days: { type: Number },
        price: { type: Number }
    },
    {
        timestamps: true
    }
)
const Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;