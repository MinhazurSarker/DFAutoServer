const mongoose = require('mongoose');
const PlanSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        days: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
    },
    {
        timestamps: true
    }
)
const Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;