const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, default:'-'},
        brand: { type: String, default:'-'},
        serial: { type: String,default:'-' },
        weight: { type: Number, required: true, default: 0, },
        pt: { type: Number, required: true, default: 0, },
        pd: { type: Number, required: true, default: 0, },
        rh: { type: Number, required: true, default: 0, },
        img: [String],
    },
    {
        timestamps: true
    }
)
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;