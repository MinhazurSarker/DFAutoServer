const User = require('../../../model/User.js');
const Setting = require('./../../../model/Setting.js')
const ExchangeRate = require('./../../../model/ExchangeRate.js');
const moment = require('moment');
const LME = require('../../../model/LME.js');
const stripeInstance = require('../../../services/stripeS.js');
const getIndex = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.requesterId });
        const settingsDocument = await Setting.findOne();
        const lme = await LME.find();
        if (lme) {
            const pt = lme?.map(doc => {
                if (doc?.ptShowPrice) {
                    return {
                        date: moment(doc.createdAt).format("DD-MM-YYYY"),
                        rate: doc.ptShowPrice,
                    };
                }
            });
            const pd = lme?.map(doc => {
                if (doc?.pdShowPrice) {
                    return {
                        date: moment(doc.createdAt).format("DD-MM-YYYY"),
                        rate: doc.pdShowPrice,
                    };
                }
            });
            const rh = lme?.map(doc => {
                if (doc?.rhShowPrice) {
                    return {
                        date: moment(doc.createdAt).format("DD-MM-YYYY"),
                        rate: doc.rhShowPrice,
                    };
                }
            });

            // const ptRatesOnly = pt.map(doc => doc?.rate ? doc.rate : 0);
            // const ptMin = Math.min(...ptRatesOnly);
            // const ptMax = Math.max(...ptRatesOnly);

            // const pdRatesOnly = pd.map(doc => doc?.rate ? doc.rate : 0);
            // const pdMin = Math.min(...pdRatesOnly);
            // const pdMax = Math.max(...pdRatesOnly);

            // const rhRatesOnly = rh.map(doc => doc?.rate ? doc.rate : 0);
            // const rhMin = Math.min(...rhRatesOnly);
            // const rhMax = Math.max(...rhRatesOnly);
            res.status(200).json({
                settings: {
                    pt: settingsDocument?.ptShowPrice,
                    pd: settingsDocument?.pdShowPrice,
                    rh: settingsDocument?.rhShowPrice
                },
                user: {
                    name: user?.name,
                    currency: user?.currency || 'AED',

                },
                pt: {
                    stats: pt,
                    // max: ptMax,
                    // min: ptMin
                },
                pd: {
                    stats: pd,
                    // max: pdMax,
                    // min: pdMin
                },
                rh: {
                    stats: rh,
                    // max: rhMax,
                    // min: rhMin
                },


            })

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
const getContacts = async (req, res) => {
    try {
        const settingsDocument = await Setting.findOne();

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

        res.status(200).json({ msg: 'success', emails: settings?.email, whatsApp: settings?.whatsApp });
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
const getCurrentBalance = async (req, res) => {
    try {
        const balance = await stripeInstance.balance.retrieve();
        const paymentIntents = await stripeInstance.paymentIntents.list({
            limit: 200,
        });
        res.status(200).json({
            balance: balance,
            paymentIntents: paymentIntents.data,
        })
        console.log(paymentIntents)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            balance: {
                object: 'balance',
                available: [{ amount: 0, currency: 'aed', }],
                pending: [{ amount: 0, currency: 'aed', }]
            },
            paymentIntents: [],
        })
    }
}

module.exports = {
    getIndex,
    getSettings,
    getCalculator,
    getContacts,
    getCurrentBalance
}
