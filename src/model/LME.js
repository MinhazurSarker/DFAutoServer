const mongoose = require('mongoose');
const LMESchema = new mongoose.Schema({
    ptPrice: { type: Number, required: true, default: 0, },
    pdPrice: { type: Number, required: true, default: 0, },
    rhPrice: { type: Number, required: true, default: 0, },
    ptShowPrice: { type: Number, required: true, default: 0, },
    pdShowPrice: { type: Number, required: true, default: 0, },
    rhShowPrice: { type: Number, required: true, default: 0, },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 3600 * 24 * 30 },
    },

},)
const LME = mongoose.model("LME", LMESchema);

module.exports = LME;