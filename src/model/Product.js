const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brands: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
        }],
        brand: { type: String, default: '-' },
        material: { type: String, default: '-' },
        continent: { type: String, default: '-' },
        country: { type: String, default: '-' },
        serial: { type: String, default: '-' },
        showWeight: { type: Number, default: 0 },
        car: { type: String, default: '-' },
        position: { type: String, default: '-' },
        deleted: { type: Boolean, default: false },
        deletedOn: { type: Number, default: 0 },
        weight: { type: Number, required: true, default: 0, },
        pt: { type: Number, required: true, default: 0, },
        pd: { type: Number, required: true, default: 0, },
        rh: { type: Number, required: true, default: 0, },
        img: [String],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    },
    {
        timestamps: true
    }
)
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;