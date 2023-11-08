const Product = require('../../../model/Product.js');
const User = require('../../../model/User.js');
const Setting = require('./../../../model/Setting.js')
const ExchangeRate = require('./../../../model/ExchangeRate.js');
const moment = require('moment');
const getIndex = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.requesterId, role: req.body.requesterRole });
        const settings = await Setting.findOne();
        const exchangeRateDocumentsGBP = await ExchangeRate.find({ base: "GBP" });
        const exchangeRateDocumentsUSD = await ExchangeRate.find({ base: "USD" });
        if (exchangeRateDocumentsGBP && exchangeRateDocumentsUSD) {

            const gbpStatistics = exchangeRateDocumentsGBP?.map(doc => {
                if (doc?.rates) {

                    const userCurrencyRate = doc?.rates[user?.currency || 'AED'];
                    return {
                        date: moment(doc.createdAt).format("DD-MM-YYYY"),
                        rate: userCurrencyRate,
                    };
                }
            });
            const usdStatistics = exchangeRateDocumentsUSD?.map(doc => {
                if (doc?.rates) {

                    const userCurrencyRate = doc?.rates[user?.currency || 'AED'];
                    return {
                        date: moment(doc.createdAt).format("DD-MM-YYYY"),
                        rate: userCurrencyRate,
                    };
                }
            });
            if (user) {
                const gbpRatesOnly = exchangeRateDocumentsGBP.map(doc => doc.rates ? doc.rates[user?.currency || 'AED'] : 0);
                const usdRatesOnly = exchangeRateDocumentsUSD.map(doc => doc.rates ? doc.rates[user?.currency || 'AED'] : 0);
                const gbpMin = Math.min(...gbpRatesOnly);
                const gbpMax = Math.max(...gbpRatesOnly);
                const usdMin = Math.min(...usdRatesOnly);
                const usdMax = Math.max(...usdRatesOnly);

                res.status(200).json({
                    gbpStatistics: gbpStatistics,
                    usdStatistics: usdStatistics,
                    gbpMin: gbpMin,
                    gbpMax: gbpMax,
                    usdMin: usdMin,
                    usdMax: usdMax,
                    user: {
                        name: user?.name,
                        currency: user?.currency || 'AED',
                        totalSearches: user?.totalSearches,
                        totalViews: user?.totalViews,
                    },
                    settings: {
                        ptShowPrice: settings?.ptShowPrice,
                        pdShowPrice: settings?.pdShowPrice,
                        rhShowPrice: settings?.rhShowPrice,
                    }
                })
            } else {
                const gbpRatesOnly = exchangeRateDocumentsGBP.map(doc => doc.rates ? doc.rates['AED'] : 0);
                const usdRatesOnly = exchangeRateDocumentsUSD.map(doc => doc.rates ? doc.rates['AED'] : 0);
                const gbpMin = Math.min(...gbpRatesOnly);
                const gbpMax = Math.max(...gbpRatesOnly);
                const usdMin = Math.min(...usdRatesOnly);
                const usdMax = Math.max(...usdRatesOnly);

                res.status(200).json({
                    gbpStatistics: gbpStatistics,
                    usdStatistics: usdStatistics,
                    gbpMin: gbpMin,
                    gbpMax: gbpMax,
                    usdMin: usdMin,
                    usdMax: usdMax,
                    user: {
                        name: null,
                        currency: 'AED',
                        totalSearches: 0,
                        totalViews: 0,
                    },
                    settings: {
                        ptShowPrice: settings?.ptShowPrice,
                        pdShowPrice: settings?.pdShowPrice,
                        rhShowPrice: settings?.rhShowPrice,
                    }
                })
            }
        }
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


module.exports = {
    getIndex,
    getSettings,
    getCalculator,
}
