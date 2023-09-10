const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, },
    role: { type: String, required: true, default: "viewer", enum: ['admin', 'editor', 'viewer', 'user'] },
    infinity: { type: Boolean, default: false },
    subEnd: { type: Number, },
    totalLogins: { type: Number, default: 0 },
    deviceModel: { type: String, },
    deviceUniqueId: { type: String, },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: "USD", },
    passChangeTime: { type: Number, },
    password: { type: String, required: true, }
})
const User = mongoose.model("User", UserSchema);

module.exports = User;