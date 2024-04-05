const mongoose = require('mongoose');
const ExchangeRate = require('../../../model/ExchangeRate.js');
const User = require('../../../model/User.js');
const Product = require('./../../../model/Product.js')
const Setting = require('./../../../model/Setting.js')
const fs = require("fs");
const History = require("../../../model/History")

// const getProducts = async (req, res) => {
//     const page = req.query.page || 1;
//     const searchString = req.query.search || '';
//     const type = req.query.type == 'ceramic' ? 'Ceramic' : req.query.type == 'metal' ? 'Metal' : '';
//     const search = searchString.replace(/\s+/g, '')
//     const carBrand = req.query.brand || null;
//     const userId = req.body.requesterId;
//     const liked = req.query.liked || 'false';
//     const match = (liked == 'true') ? ((carBrand) ? {
//         $and: [
//             {
//                 $or: [
//                     { name: { $regex: search, $options: "i" } },
//                     { serial: { $regex: search, $options: "i" } },
//                 ],
//             },
//             {
//                 $or: [
//                     { material: { $regex: type, $options: "i" } },
//                 ],
//             }
//         ],
//         // $or: [
//         //     { name: { $regex: search, $options: "i" } },
//         //     { serial: { $regex: search, $options: "i" } },
//         //     { material: { $regex: type, $options: "i" } },
//         // ],
//         deleted: { $ne: true },

//         // material: { $regex: type, $options: "i" },

//         // material: { $regex: type, $options: "i" },
//         brands: { $in: [mongoose.Types.ObjectId(carBrand)] },
//         likes: { $in: [mongoose.Types.ObjectId(userId)] },
//     } : {
//         likes: { $in: [mongoose.Types.ObjectId(userId)] },
//         // $or: [
//         //     { name: { $regex: search, $options: "i" } },
//         //     { serial: { $regex: search, $options: "i" } }
//         // ],
//         $and: [
//             {
//                 $or: [
//                     { name: { $regex: search, $options: "i" } },
//                     { serial: { $regex: search, $options: "i" } },
//                 ],
//             },
//             {
//                 $or: [
//                     { material: { $regex: type, $options: "i" } },
//                 ],
//             }
//         ],
//         deleted: { $ne: true },
//         // material: { $regex: type, $options: "i" },
//     }) : ((carBrand) ? {
//         // $or: [
//         //     { name: { $regex: search, $options: "i" } },
//         //     { serial: { $regex: search, $options: "i" } },
//         // ],
//         $and: [
//             {
//                 $or: [
//                     { name: { $regex: search, $options: "i" } },
//                     { serial: { $regex: search, $options: "i" } },
//                 ],
//             },
//             {
//                 $or: [
//                     { material: { $regex: type, $options: "i" } },
//                 ],
//             }
//         ],
//         deleted: { $ne: true },
//         // material: { $regex: type, $options: "i" },
//         brands: { $in: [mongoose.Types.ObjectId(carBrand)] },
//     } : {
//         // $or: [
//         //     { name: { $regex: search, $options: "i" } },
//         //     { serial: { $regex: search, $options: "i" } },
//         // ],
//         $and: [
//             {
//                 $or: [
//                     { name: { $regex: search, $options: "i" } },
//                     { serial: { $regex: search, $options: "i" } },
//                 ],
//             },
//             {
//                 $or: [
//                     { material: { $regex: type, $options: "i" } },
//                 ],
//             }
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
//             }

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
    const page = parseInt(req.query.page) || 1;
    const searchString = req.query.search || '';
    const type = req.query.type == 'ceramic' ? 'Ceramic' : req.query.type == 'metal' ? 'Metal' : '';

    const carBrand = req.query.brand || null;
    const userId = req.body.requesterId;
    const liked = req.query.liked || 'false';
    const sort = parseInt(req.query.sort) || -1;

    const regexPattern = searchString
        .split('')
        .map(char => {
            if (char.toLowerCase() === 'o' || char === '0') {
                return '[o0]';
            } else if (char === ' ') {
                return '\\s*';
            } else {
                return char;
            }
        })
        .join('.*');


    const match = {
        $or: [
            { name: searchString },
            { name: { $regex: regexPattern, $options: "i" } },
            // { serial: { $regex: regexPattern, $options: "i" } }
        ],
        deleted: { $ne: true },
    };

    if (type !== '') {
        match.material = { $regex: type, $options: "i" };
    }

    if (carBrand) {
        match.brands = { $in: [new mongoose.Types.ObjectId(carBrand)] };
    }

    if (liked === 'true' || liked == true) {
        match.likes = { $in: [new mongoose.Types.ObjectId(userId)] };
    }

    try {
        const settings = await Setting.findOne();
        const user = await User.findOne({ _id: req.body.requesterId });

        const findMyRate = async (currencyCode, base) => {
            const exchangeRate = await ExchangeRate.findOne({ base: base, }).sort({ createdAt: -1 }).exec();
            if (exchangeRate && exchangeRate?.rates && exchangeRate?.rates.hasOwnProperty(currencyCode)) {
                return exchangeRate.rates[currencyCode];
            } else {
                return 0;
            }
        }
        const products = await Product.aggregate([
            {
                $match: match
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
            },
            {
                $addFields: {
                    isLiked: {
                        $in: [new mongoose.Types.ObjectId(user?._id), "$likes"]
                    }
                }
            }
        ]);
        const totalDocs = await Product.countDocuments(match);
        const pages = Math.ceil(totalDocs / 50);

        res.status(200).send({
            products: products,
            lastPage: page * 50 >= totalDocs,
            pages: pages,
            current: page,
            settings: {
                ptPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.ptPrice : 0,
                pdPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.pdPrice : 0,
                rhPrice: (user && ['admin', 'editor', 'viewer'].includes(req.body.requesterRole)) ? settings?.rhPrice : 0,
                discount: user?.discount || 0,
                gbpToCurrency: await findMyRate(user?.currency || "AED", "GBP"),
                usdToCurrency: await findMyRate(user?.currency || "AED", "USD"),
                canSeePrice: user ? ['admin', 'editor', 'viewer'].includes(req.body.requesterRole) : false,
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
            await product?.save()
            console.log({ ...JSON.parse(JSON.stringify(product)) })
            res
                .status(200)
                .json({ type: "liked", msg: "Added to favorites", product: { isLiked: true, ...JSON.parse(JSON.stringify(product)) } });
        } else {
            product?.likes?.pull(req.body.requesterId);
            await product?.save()
            res
                .status(200)
                .json({ type: "removed", msg: "removed from favorites", product: { isLiked: false, ...JSON.parse(JSON.stringify(product)) } });
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
                    liked: product.likes.includes(user?._id),
                },
            })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}



module.exports = {
    getProducts,
    getProduct,
    likeProduct,
}