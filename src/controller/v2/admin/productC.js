const mongoose = require('mongoose');
const ExchangeRate = require('../../../model/ExchangeRate.js');
const User = require('../../../model/User.js');
const Product = require('./../../../model/Product.js')
const Setting = require('./../../../model/Setting.js')
const fs = require("fs");
const History = require("../../../model/History")
const createProduct = async (req, res) => {
    const files = req.files.map((file) => file.path.replace("public", "").split("\\").join("/"));
    try {
        const latestProduct = await Product.findOne().sort({ sn: -1 });

        if (!latestProduct) { return res.status(500).send("Something went wrong"); }
        const nextSerialNumber = latestProduct ? latestProduct.sn + 1 : 1;

        const product = await new Product({
            name: req.body.name,
            brand: req.body.brand,
            serial: req.body.serial,
            brands: JSON.parse(req.body.brands),
            material: req.body.material,
            continent: req.body.continent,
            country: req.body.country,
            car: req.body.car,
            position: req.body.position,
            weight: Number(req.body.weight) || 0,
            showWeight: Number(req.body.showWeight) || 0,
            pt: Number(req.body.pt) || 0,
            pd: Number(req.body.pd) || 0,
            rh: Number(req.body.rh) || 0,
            img: files,
            sn: nextSerialNumber,
        })
        await product.save()
        res.status(200).json({ msg: 'success', product: product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'error' })
    }
}
// const getProducts = async (req, res) => {
//     const page = req.query.page || 1;
//     const searchString = req.query.search || '';
//     const carBrand = req.query.brand || null;
//     const search = searchString
//     const match = ((carBrand) ? {
//         $or: [
//             { name: { $regex: search, $options: "i" } },
//             { serial: { $regex: search, $options: "i" } }
//         ],
//         deleted: { $ne: true },
//         // material: { $regex: type, $options: "i" },
//         brands: { $in: [mongoose.Types.ObjectId(carBrand)] },
//     } : {
//         $or: [
//             { name: { $regex: search, $options: "i" } },
//             { serial: { $regex: search, $options: "i" } }
//         ],
//         deleted: { $ne: true },
//         // material: { $regex: type, $options: "i" },
//     })
//     try {
//         const settings = await Setting.findOne()
//         const user = await User.findOne({ _id: req.body.requesterId })
//         const findMyRate = async (currencyCode, base) => {
//             const exchangeRate = await ExchangeRate.findOne({ base: base, }).sort({ createdAt: -1 }).exec();
//             if (exchangeRate && exchangeRate?.rates && exchangeRate?.rates.hasOwnProperty(currencyCode)) {
//                 return exchangeRate.rates[currencyCode];
//             } else {
//                 return 0;
//             }
//         }
//         const products = await Product.aggregate([
//             {
//                 $match: match
//             },
//             {
//                 $lookup: {
//                     from: 'brands',
//                     localField: 'brands',
//                     foreignField: '_id',
//                     as: 'brands'
//                 }
//             },

//             {
//                 $sort: { createdAt: -1, _id: -1 }
//             },
//             {
//                 $skip: (page - 1) * 50
//             },
//             {
//                 $limit: 50
//             },

//         ]);


//         const totalDocs = await Product.countDocuments(match);
//         const pages = Math.ceil(totalDocs / 50)
//         if (products) {
//             res.status(200).send({
//                 products: products,
//                 lastPage: page * 50 >= totalDocs ? true : false,
//                 pages: pages,
//                 current: page,
//                 settings: {
//                     ptPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.ptPrice : 0,
//                     pdPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.pdPrice : 0,
//                     rhPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.rhPrice : 0,
//                     discount: user?.discount || 0,
//                     gbpToCurrency: await findMyRate(user?.currency || "AED", "GBP"),
//                     usdToCurrency: await findMyRate(user?.currency || "AED", "USD"),
//                     canSeePrice: user ? ['admin', 'editor', 'viewer'].includes(req.body.requesterRole) : false,
//                     currency: user?.currency || "AED",
//                 },
//             });
//         } else {
//             res.status(400).send({
//                 products: [],
//                 lastPage: true,
//                 pages: 1,
//                 current: 1,
//                 settings: {
//                     ptPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.ptPrice : 0,
//                     pdPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.pdPrice : 0,
//                     rhPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.rhPrice : 0,
//                     discount: user?.discount || 0,
//                     gbpToCurrency: await findMyRate(user?.currency || "AED", "GBP"),
//                     usdToCurrency: await findMyRate(user?.currency || "AED", "USD"),
//                     canSeePrice: user ? ['admin', 'editor', 'viewer'].includes(req.body.requesterRole) : false,
//                     currency: user?.currency || "AED",
//                 },
//             });
//         }
//     } catch (error) {
//         res.status(500).json({ err: 'error' })
//     }
// }
const getProducts = async (req, res) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const sort = parseInt(req.query.sort) || -1;
        const searchString = req.query.search || '';
        const carBrand = req.query.brand || null;
        const userRole = req.body.requesterRole;
        const userId = req.body.requesterId;
        const type = req.query.type == 'ceramic' ? 'Ceramic' : req.query.type == 'metal' ? 'Metal' : '';

        // Create the search filter
        const searchFilter = {
            $or: [
                { name: { $regex: searchString, $options: "i" } },
                { serial: { $regex: searchString, $options: "i" } }
            ],
            deleted: { $ne: true },
        };
        if (type !== '') {
            searchFilter.material = { $regex: type, $options: "i" };
        }
        if (carBrand) {
            searchFilter.brands = { $in: [mongoose.Types.ObjectId(carBrand)] };
        }


        const products = await Product.aggregate([
            {
                $match: searchFilter
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brands',
                    foreignField: '_id',
                    as: 'brands'
                }
            },
            {
                $sort: { createdAt: sort == 1 ? 1 : -1, _id: sort == 1 ? 1 : -1 }
            },
            {
                $skip: (page - 1) * 50
            },
            {
                $limit: 50
            }
        ]);

        // Calculate total pages
        const totalDocs = await Product.countDocuments(searchFilter);
        const pages = Math.ceil(totalDocs / 50);

        // Prepare the response
        const settings = await Setting.findOne();
        const user = await User.findOne({ _id: userId });
        const findMyRate = async (currencyCode, base) => {
            const exchangeRate = await ExchangeRate.findOne({ base: base, }).sort({ createdAt: -1 }).exec();
            if (exchangeRate && exchangeRate?.rates && exchangeRate?.rates.hasOwnProperty(currencyCode)) {
                return exchangeRate.rates[currencyCode];
            } else {
                return 0;
            }
        }
        res.status(200).send({
            products: products,
            lastPage: page * 50 >= totalDocs,
            pages: pages,
            current: page,
            settings: {
                ptPrice: (user && ['admin', 'editor', 'viewer'].includes(userRole)) ? settings?.ptPrice : 0,
                pdPrice: (user && ['admin', 'editor', 'viewer'].includes(userRole)) ? settings?.pdPrice : 0,
                rhPrice: (user && ['admin', 'editor', 'viewer'].includes(userRole)) ? settings?.rhPrice : 0,
                discount: user?.discount || 0,
                gbpToCurrency: await findMyRate(user?.currency || "AED", "GBP"),
                usdToCurrency: await findMyRate(user?.currency || "AED", "USD"),
                canSeePrice: user ? ['admin', 'editor', 'viewer'].includes(userRole) : false,
                currency: user?.currency || "AED",
            },
        });
    } catch (error) {
        res.status(500).json({ err: 'error' });
    }
};

const likeProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.productId }).populate('brands', ' _id name img')
        if (!product?.likes?.includes(req.body.requesterId)) {
            product?.likes?.push(req.body.requesterId);
            product?.save()
            res
                .status(200)
                .json({ type: "liked", msg: "Added to favorites" });
        } else {
            product.likes.pull(req.body.requesterId);
            product?.save()
            res
                .status(200)
                .json({ type: "removed", msg: "removed from favorites" });
        }

    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const getProduct = async (req, res) => {
    try {
        const settings = await Setting.findOne()
        const user = await User.findOne({ _id: req.body.requesterId })
        const product = await Product.findOne({ _id: req.params.productId }).populate('brands', ' _id name img')
        const findMyRate = async (currencyCode, base) => {
            const exchangeRate = await ExchangeRate.findOne({ base: base, }).sort({ createdAt: -1 }).exec();
            if (exchangeRate && exchangeRate?.rates && exchangeRate?.rates.hasOwnProperty(currencyCode)) {
                return exchangeRate.rates[currencyCode];
            } else {
                return 0;
            }
        }
        if (product) {
            const history = await new History({
                user: user?._id,
                product: product._id,
                time: Date.now()
            })
            await history.save()
            res.status(200).json({
                msg: 'success', product: product, settings: {
                    ptPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.ptPrice : 0,
                    pdPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.pdPrice : 0,
                    rhPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.rhPrice : 0,
                    discount: user?.discount || 0,
                    gbpToCurrency: await findMyRate(user?.currency, "GBP"),
                    usdToCurrency: await findMyRate(user?.currency, "USD"),
                    canSeePrice: ['admin', 'editor', 'viewer'].includes(req.body.requesterRole),
                    currency: user?.currency,
                    liked: user ? product.likes.includes(user?._id) : false,
                },
            })
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
            product.serial = req.body.serial;
            product.car = req.body.car;
            product.position = req.body.position;
            product.showWeight = Number(req.body.showWeight) || 0;
            product.weight = Number(req.body.weight) || 0;
            product.pt = Number(req.body.pt) || 0;
            product.pd = Number(req.body.pd) || 0;
            product.rh = Number(req.body.rh) || 0;
            product.brands = JSON.parse(req.body.brands);
            product.material = req.body.material;
            product.continent = req.body.continent;
            product.country = req.body.country;
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
    const addMonths = (timestamp, monthsToAdd) => {
        const date = new Date(timestamp);
        date.setMonth(date.getMonth() + monthsToAdd);
        return date.getTime();
    }
    try {
        const product = await Product.findOne({ _id: req.params.productId })
        if (product) {

            product.deleted = true;
            product.deletedOn = addMonths(Date.now(), 6);
            await product.save()
            res.status(200).json({ msg: 'success' })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const getDeletedProducts = async (req, res) => {
    const page = req.params.page || 1
    try {
        const totalDocs = await Product.countDocuments({ deleted: true });
        const pages = Math.ceil(totalDocs / 25)
        const histories = await Product.find({ deleted: true })
            .sort({ createdAt: -1 })
            .skip(25 * (page - 1))
            .limit(25)
        res
            .status(200)
            .json({ msg: "success", array: histories, current: page, pages: pages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'error' })
    }
}
const restoreProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        if (product) {
            product.deleted = false;
            product.deletedOn = 0;
            await product.save()
            res.status(200).json({ msg: 'success' })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const deleteProductPermanent = async (req, res) => {
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
    likeProduct,
    getDeletedProducts,
    restoreProduct,
    deleteProductPermanent,
}