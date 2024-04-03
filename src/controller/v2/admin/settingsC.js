const Product = require('../../../model/Product.js');
const Brand = require('../../../model/Brand.js');
const User = require('../../../model/User.js');
const Setting = require('./../../../model/Setting.js')
const ExchangeRate = require('./../../../model/ExchangeRate.js');
const moment = require('moment');
const LME = require('../../../model/LME.js');
const getIndex = async (req, res) => {
    try {
        const users = await User.countDocuments({ role: 'user' });
        const viewers = await User.countDocuments({ role: 'viewer' });
        const editor = await User.countDocuments({ role: 'editor' });
        const admins = await User.countDocuments({ role: 'admin' });
        const products = await Product.countDocuments({ deleted: { $ne: true } });
        const ceramic = await Product.countDocuments({ deleted: { $ne: true }, material: { $regex: "Ceramic", $options: "i" } });
        const metal = await Product.countDocuments({ deleted: { $ne: true }, material: { $regex: "Metal", $options: "i" } });
        const brands = await Brand.countDocuments();

        res.status(200).json({
            users: users,
            viewers: viewers,
            editors: editor,
            admins: admins,
            products: products,
            ceramic: ceramic,
            metal: metal,
            brands: brands,
        })

    } catch (error) {
        res.status(500).json({ err: 'error', });
        console.error(error)
    }
}
const getSettings = async (req, res) => {
    try {
        const settingsDocument = await Setting.findOne();
        const user = await User.findOne({ _id: req.body.requesterId }) || null
        const findMyRate = async (currencyCode, base) => {
            const exchangeRate = await ExchangeRate.findOne({ base: base, }).sort({ createdAt: -1 }).exec();
            if (exchangeRate && exchangeRate?.rates && exchangeRate?.rates.hasOwnProperty(currencyCode)) {
                return exchangeRate.rates[currencyCode];
            } else {
                return 0;
            }
        }
        if (!settingsDocument) {
            const defaultSettings = {
                id: 1,
                ptPrice: 0,
                pdPrice: 0,
                rhPrice: 0,
                ptShowPrice: 0,
                pdShowPrice: 0,
                rhShowPrice: 0,
                email: [],
                whatsApp: []
            };
            await Setting.create(defaultSettings);
        }
        const settings = await Setting.findOne();

        res.status(200).json({ msg: 'success', settings: settings, gbpToCurrency: await findMyRate(user?.currency || "AED", "GBP"), usdToCurrency: await findMyRate(user?.currency || "AED", "USD"), currency: user?.currency || "AED" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'error', });
    }
}
const getCurrencies = async (req, res) => {
    try {
        const getRates = async (base) => {
            const exchangeRate = await ExchangeRate.findOne({ base: base, }).sort({ createdAt: -1 }).exec();
            return exchangeRate;
        }
        res.status(200).json({ msg: 'success', gbpRates: await getRates("GBP"), usdRates: await getRates("USD"), });
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'error', });
    }
}
const getCalculator = async (req, res) => {
    try {
        const getRates = async (base) => {
            const exchangeRate = await ExchangeRate.findOne({ base: base, }).sort({ createdAt: -1 }).exec();
            return exchangeRate;
        }
        res.status(200).json({ msg: 'success', gbpRates: await getRates("GBP"), usdRates: await getRates("USD"), });
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'error', });
    }
}
const updateSettings = async (req, res) => {
    try {
        const settingsDocument = await Setting.findOne();
        if (!settingsDocument) {
            const defaultSettings = {
                id: 1,
                email: JSON.parse(req.body.email) || [],
                whatsApp: JSON.parse(req.body.whatsApp) || [],

            };
            await Setting.create(defaultSettings);
        } else {
            settingsDocument.id = 1;
            settingsDocument.email = JSON.parse(req.body.email) || [];
            settingsDocument.whatsApp = JSON.parse(req.body.whatsApp) || [];
            await settingsDocument.save()
        }
        const settings = await Setting.findOne();
        res.status(200).json({ msg: 'success', settings: settings });
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'error', });
    }
}
const updateLME = async (req, res) => {
    console.log('hi')
    try {
        const settingsDocument = await Setting.findOne();
        if (!settingsDocument) {
            const defaultSettings = {
                id: 1,
                ptPrice: Number(req.body.ptPrice) || 0,
                pdPrice: Number(req.body.pdPrice) || 0,
                rhPrice: Number(req.body.rhPrice) || 0,
                ptShowPrice: Number(req.body.ptShowPrice) || 0,
                pdShowPrice: Number(req.body.pdShowPrice) || 0,
                rhShowPrice: Number(req.body.rhShowPrice) || 0,

            };
            await Setting.create(defaultSettings);
        } else {
            settingsDocument.id = 1;
            settingsDocument.ptPrice = Number(req.body.ptPrice) || 0;
            settingsDocument.pdPrice = Number(req.body.pdPrice) || 0;
            settingsDocument.rhPrice = Number(req.body.rhPrice) || 0;
            settingsDocument.ptShowPrice = Number(req.body.ptShowPrice) || 0;
            settingsDocument.pdShowPrice = Number(req.body.pdShowPrice) || 0;
            settingsDocument.rhShowPrice = Number(req.body.rhShowPrice) || 0;
            await settingsDocument.save()
        }
        const today = moment(Date.now()).format('YYYY-MM-DD')
        const lastLme = await LME.findOne().sort({ createdAt: -1 })
        if (today == moment(lastLme?.createdAt).format('YYYY-MM-DD') && lastLme) {
            lastLme.ptPrice = Number(req.body.ptPrice) || 0;
            lastLme.pdPrice = Number(req.body.pdPrice) || 0;
            lastLme.rhPrice = Number(req.body.rhPrice) || 0;
            lastLme.ptShowPrice = Number(req.body.ptShowPrice) || 0;
            lastLme.pdShowPrice = Number(req.body.pdShowPrice) || 0;
            lastLme.rhShowPrice = Number(req.body.rhShowPrice) || 0;
            await lastLme.save()
        } else {
            const lme = await new LME({
                ptPrice: Number(req.body.ptPrice) || 0,
                pdPrice: Number(req.body.pdPrice) || 0,
                rhPrice: Number(req.body.rhPrice) || 0,
                ptShowPrice: Number(req.body.ptShowPrice) || 0,
                pdShowPrice: Number(req.body.pdShowPrice) || 0,
                rhShowPrice: Number(req.body.rhShowPrice) || 0,
            })
            await lme.save()
        }
        const settings = await Setting.findOne();
        res.status(200).json({ msg: 'success', settings: settings });
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'error', });
    }
}
module.exports = {
    getIndex,
    getSettings,
    updateSettings,
    getCalculator,
    getCurrencies,
    updateLME,
}
