const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, },
    role: { type: String, required: true, default: "viewer", enum: ['admin', 'editor', 'viewer'] },
    password: { type: String, required: true, }
})
const User = mongoose.model("User", UserSchema);

module.exports = User;