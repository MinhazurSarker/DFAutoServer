const Product = require('../../model/Product.js');
const User = require('../../model/User.js');
const Setting = require('./../../model/Setting.js')
const getIndex = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDocs = await Product.countDocuments();
        res.status(200).json({ msg: 'success', totalUsers: totalUsers, totalDocs: totalDocs });
    } catch (error) {
        res.status(500).json({ err: 'error', });
    }
}
const getSettings = async (req, res) => {
    try {
        const settingsDocument = await Setting.findOne();
        if (!settingsDocument) {
            const defaultSettings = {
                id: 1,
                ptPrice: 0,
                pdPrice: 0,
                rhPrice: 0,
                usdToAed: 0,
                gbpToAed: 0,
            };
            await Setting.create(defaultSettings);
        }
        const settings = await Setting.findOne();
        res.status(200).json({ msg: 'success', settings: settings });
    } catch (error) {
        res.status(500).json({ err: 'error', });
    }
}
const updateSettings = async (req, res) => {
    try {
        const settingsDocument = await Setting.findOne();
        if (!settingsDocument) {
            const defaultSettings = {
                id: 1,
                ptPrice: Number(req.body.ptPrice) || 0,
                pdPrice: Number(req.body.pdPrice) || 0,
                rhPrice: Number(req.body.rhPrice) || 0,
                usdToAed: Number(req.body.usdToAed) || 0,
                gbpToAed: Number(req.body.gbpToAed) || 0,
            };
            await Setting.create(defaultSettings);
        } else {
            settingsDocument.id = 1;
            settingsDocument.ptPrice = Number(req.body.ptPrice) || 0;
            settingsDocument.pdPrice = Number(req.body.pdPrice) || 0;
            settingsDocument.rhPrice = Number(req.body.rhPrice) || 0;
            settingsDocument.usdToAed = Number(req.body.usdToAed) || 0;
            settingsDocument.gbpToAed = Number(req.body.gbpToAed) || 0;
            await settingsDocument.save()
        }
        const settings = await Setting.findOne();
        res.status(200).json({ msg: 'success', settings: settings });
    } catch (error) {
        res.status(500).json({ err: 'error', });
    }
}
module.exports = {
    getIndex,
    getSettings,
    updateSettings,
}
