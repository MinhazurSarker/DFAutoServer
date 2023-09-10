const Brand = require('../../../model/Brand.js')
const fs = require("fs");
const getBrands = async (req, res) => {
    const searchString = req.query.search || '';
    const search = searchString.replace(/\s+/g, '')
    try {
        const brands = await Brand.find({
            name: { $regex: search, $options: "i" },
        });
        if (brands) {
            res.status(200).send({
                brands: brands,

            });
        } else {
            res.status(400).send({
                brands: [],
            });
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}

module.exports = {
    getBrands,
}