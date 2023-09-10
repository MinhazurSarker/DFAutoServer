const mongoose = require('mongoose');
const HistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        time: { type: Number },

        createdAt: {
            type: Date,
            default: Date.now,
            index: { expires: 3600 * 24 * 30 },
        },
    },

)
const History = mongoose.model("History", HistorySchema);
module.exports = History;