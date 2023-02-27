const Product = require('./../model/Product')
const Setting = require('./../model/Setting')
const fs = require("fs");
const createProduct = async (req, res) => {
    const files = req.files.map((file) => file.path.replace("public", "").split("\\").join("/"));
    try {
        const product = await new Product({
            name: req.body.name,
            type: req.body.type,
            brand: req.body.brand,
            serial: req.body.serial,
            weight: Number(req.body.weight) || 0,
            pt: Number(req.body.pt) || 0,
            pd: Number(req.body.pd) || 0,
            rh: Number(req.body.rh) || 0,
            img: files,
        })
        await product.save()
        res.status(200).json({ msg: 'success', product: product })
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const getProducts = async (req, res) => {
    const page = req.query.page || 1;
    const search = req.query.search || '';
    const match = {
        name: { $regex: search, $options: "i" }
    }
    try {
        const settings = await Setting.findOne()
        const products = await Product.aggregate([
            {
                $match: match
            },
            {
                $addFields: {
                    featuredImage: { $arrayElemAt: ['$img', 0] }
                }
            },
            {
                $project: {
                    img: 0
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (page - 1) * 100
            },
            {
                $limit: 100
            },
        ]);
        const totalDocs = await Product.countDocuments(match);
        const pages = Math.ceil(totalDocs / 100)
        if (products) {
            res.status(200).send({
                products: products,
                lastPage: page * 100 >= totalDocs ? true : false,
                pages: pages,
                current: page,
                settings: settings,
            });
        } else {
            res.status(400).send({
                products: [],
                lastPage: true,
                pages: 1,
                current: 1,
                settings: settings,
            });
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const getProduct = async (req, res) => {
    try {
        const settings = await Setting.findOne();
        const product = await Product.findOne({ _id: req.params.productId })
        if (product) {
            res.status(200).json({ msg: 'success', product: product, settings: settings })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const updateProduct = async (req, res) => {
    const files = req.files.map((file) => file.path.replace("public", "").split("\\").join("/"));
    const remove = JSON.parse(req.body.remove);
    try {
        const product = await Product.findOne({ _id: req.params.productId })
        if (product) {
            product.name = req.body.name;
            product.type = req.body.type;
            product.brand = req.body.brand;
            product.serial = req.body.serial;
            product.weight = Number(req.body.weight) || 0;
            product.pt = Number(req.body.pt) || 0;
            product.pd = Number(req.body.pd) || 0;
            product.rh = Number(req.body.rh) || 0;
            product.img = product.img.concat(files);
            product.img = product.img.filter((item) => !remove.includes(item));
            await product.save()
            remove.map(
                (item) => {
                    fs.unlink("./public" + item, (err) => {
                        console.log(err);
                    })
                }
            )
            res.status(200).json({ msg: 'success', product: product })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.productId })
        if (product) {

            product.img.map(
                (item) => {
                    fs.unlink("./public" + item, (err) => {
                        console.log(err);
                    })
                }
            )
            await Product.deleteOne({ _id: req.params.productId })
            res.status(200).json({ msg: 'success' })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
}