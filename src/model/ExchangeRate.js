const mongoose = require('mongoose');
const ExchaneRateSchema = new mongoose.Schema({
    base: { type: 'string' },
    rates: { type: 'object' },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 3600 * 24 * 30 },
    },

},)
const ExchaneRate = mongoose.model("ExchaneRate", ExchaneRateSchema);

module.exports = ExchaneRate;