const Brand = require('../../../model/Brand.js')
const fs = require("fs");

const createBrand = async (req, res) => {
    try {
        const file = req.file.path.replace("public", "").split("\\").join("/");
        const brand = await new Brand({
            name: req.body.name,
            img: file,
        })
        await brand.save()
        res.status(200).json({ msg: 'success', brand: brand })
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
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
const getBrand = async (req, res) => {
    try {
        const brand = await Brand.findOne({ _id: req.params.brandId })
        if (brand) {
            res.status(200).json({ msg: 'success', brand: brand, })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const updateBrand = async (req, res) => {

    try {
        const brand = await Brand.findOne({ _id: req.params.brandId })
        console.log(req.file)
        if (brand) {
            brand.name = req.body.name;
            if (req?.file !== undefined) {
                if (brand?.img.length !== 0) {
                    fs.unlink("./public" + brand?.img, (err) => {
                        console.log(err);
                    });
                }
                brand.img = req.file.path.replace("public", "").split("\\").join("/")
            }
            await brand.save()
            res.status(200).json({ msg: 'success', brand: brand })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'error' })
    }
}
const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findOne({ _id: req.params.brandId })
        if (brand) {
            fs.unlink("./public" + brand?.img, (err) => {
                console.log(err);
            });
            await Brand.deleteOne({ _id: req.params.brandId })
            res.status(200).json({ msg: 'success' })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}

module.exports = {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,

}