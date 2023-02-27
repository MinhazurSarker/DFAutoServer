const Setting = require('./../model/Setting')
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
                ptPrice: req.body.ptPrice,
                pdPrice: req.body.pdPrice,
                rhPrice: req.body.rhPrice,
                usdToAed: req.body.usdToAed,
                gbpToAed: req.body.gbpToAed,
            };
            await Setting.create(defaultSettings);
        } else {
            settingsDocument.id = 1;
            settingsDocument.ptPrice = req.body.ptPrice;
            settingsDocument.pdPrice = req.body.pdPrice;
            settingsDocument.rhPrice = req.body.rhPrice;
            settingsDocument.usdToAed = req.body.usdToAed;
            settingsDocument.gbpToAed = req.body.gbpToAed;
            await settingsDocument.save()
        }
        const settings = await Setting.findOne();
        res.status(200).json({ msg: 'success', settings: settings });
    } catch (error) {
        res.status(500).json({ err: 'error', });
    }
}
module.exports = {
    getSettings,
    updateSettings,
}
