const mongoose = require('mongoose');
const SettingSchema = new mongoose.Schema({
    id: { type: Number, default: 1 },
    ptPrice: { type: Number, required: true, default: 0, },
    pdPrice: { type: Number, required: true, default: 0, },
    rhPrice: { type: Number, required: true, default: 0, },
    usdToAed: { type: Number, required: true, default: 0, },
    gbpToAed: { type: Number, required: true, default: 0, },
})
const Setting = mongoose.model("Setting", SettingSchema);
module.exports = Setting;