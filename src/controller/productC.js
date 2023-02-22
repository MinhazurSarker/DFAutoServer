const Product = require('../model/product')

const createProduct = async (req, res) => {
    try {

        const product = await new Product({

        })
        await product.save()
        res.status(200).json({ msg: 'success', product: product })
    } catch (error) {
        res.status(500).json({ err: 'error' })

    }
}
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json({ msg: 'success', products: products })
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id })
        res.status(200).json({ msg: 'success', product: product })
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id })
        res.status(200).json({ msg: 'success', product: product })
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const deleteProduct = async (req, res) => {
    try {
        await Product.deleteOne({ id: req.params.id })
        res.status(200).json({ msg: 'success' })
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