const User = require('./../../../model/User.js');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { reverseString } = require('../../../utils/utils.js');
const ExchangeRate = require('../../../model/ExchangeRate.js');
dotenv.config();

const jwt_secret = process.env.JWT_SECRET || '';

const registerUser = async (req, res) => {
    try {
        const ue = await User.findOne({ email: req.body.email })
        const up = await User.findOne({ phone: req.body.phone })
        if (!ue && !up) {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const user = await new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                currency: "USD",
                role: 'user',
                deviceModel: req.body.deviceModel,
                deviceUniqueId: req.body.deviceUniqueId,
                passChangeTime: Date.now(),
                password: hashPassword
            })
            await user.save()
            const payload = {
                userId: user._id,
                userRole: user.role,
                passChangeTime: user.passChangeTime,
                deviceModel: req.body.deviceModel,
                deviceUniqueId: req.body.deviceUniqueId,
            };
            const token = jwt.sign(payload, jwt_secret, {
                expiresIn: 60 * 60 * 24 * 30 * 6,
            });
            res.status(200).json({ msg: 'success', token: reverseString(token), user: { name: user.name, role: user.role, email: user.email, phone: user.phone, _id: user._id, currency: user.currency } })
        } else {
            res.status(200).json({ err: 'userAlreadyExists' })
        }
    } catch (error) {
        res.status(500).json({ err: 'something went wrong' })
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        console.log(user)
        if (user) {
            const isValid = await bcrypt.compare(req.body.password, user.password)
            if (isValid) {
                user.deviceModel = req.body.deviceModel
                user.deviceUniqueId = req.body.deviceUniqueId

                user.totalLogins += 1;
                user.save()
                const payload = {
                    userId: user._id,
                    userRole: user.role,
                    passChangeTime: user.passChangeTime,
                    deviceModel: req.body.deviceModel,
                    deviceUniqueId: req.body.deviceUniqueId,
                };
                const token = jwt.sign(payload, jwt_secret, {
                    expiresIn: 60 * 60 * 24 * 30 * 6,
                });
                res.status(200).json({ msg: 'success', token: reverseString(token), user: { name: user.name, role: user.role, email: user.email, phone: user.phone, _id: user._id, currency: user.currency } })
            } else {
                console.log(user)
                res.status(401).json({ err: 'invalid' })
            }
        } else {
            res.status(404).json({ err: 'notFound' })

        }
    } catch (error) {
        res.status(500).json({ err: 'something went wrong' })
        console.log(error)
    }
}

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.requesterId })
        const exchangeRates = await ExchangeRate.findOne();
        const rates = exchangeRates?.rates;
        if (user && rates && typeof rates == 'object') {
            res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, phone: user.phone, _id: user._id, autoRenew: user?.autoRenew, currency: user.currency, discount: user.discount }, currencies: Object.keys(rates) })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (err) {
        res.status(400).json({ err: err })
    }
}

const updateProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.requesterId });
        if (user) {
            if (req.body.email) {
                const u = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
                if (u) {
                    return res.status(500).json({ err: 'email already in use', });
                }
                user.email = req.body.email;
            }
            if (req.body.phone) {
                const u = await User.findOne({ phone: req.body.phone, _id: { $ne: user._id } });
                if (u) {
                    return res.status(500).json({ err: 'phone already in use', });
                }
                user.phone = req.body.phone;
            }
            user.currency = req.body.currency;
            user.discount = Number(req.body.discount || 0);
            user.name = req.body.name;
            if (req.body.oldPassword && req.body.newPassword) {
                const isValid = await bcrypt.compare(req.body.oldPassword, user.password)
                if (isValid) {
                    const hashPassword = await bcrypt.hash(req.body.password, 10);
                    user.password = hashPassword;
                    user.passChangeTime = Date.now();
                }
            }
            user.save()
            const payload = {
                userId: user._id,
                userRole: user.role,
                passChangeTime: req.body.passChangeTime,
                deviceModel: user.deviceModel,
                deviceUniqueId: user.deviceUniqueId,
            };
            const token = jwt.sign(payload, jwt_secret, {
                expiresIn: 60 * 60 * 24 * 30 * 6,
            });
            res.status(200).json({ msg: 'success', token: reverseString(token), user: { name: user.name, role: user.role, email: user.email, phone: user.phone, _id: user._id, currency: user.currency } })
        } else {
            res.status(404).json({ err: 'notFound', });
        }

    } catch (error) {
        res.status(500).json({ err: 'error', });
    }
}
const turnOffAutoRenew = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.requesterId });
        if (user) {
            user.autoRenew = false;

            user.save()
            const payload = {
                userId: user._id,
                userRole: user.role,
                passChangeTime: req.body.passChangeTime,
                deviceModel: user.deviceModel,
                deviceUniqueId: user.deviceUniqueId,
            };
            const token = jwt.sign(payload, jwt_secret, {
                expiresIn: 60 * 60 * 24 * 30 * 6,
            });
            res.status(200).json({ msg: 'success', token: reverseString(token), user: { name: user.name, role: user.role, email: user.email, phone: user.phone, _id: user._id, currency: user.currency } })
        } else {
            res.status(404).json({ err: 'notFound', });
        }

    } catch (error) {
        res.status(500).json({ err: 'error', });
    }
}
const deleteProfile = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.body.requesterId })
        res.status(200).json({ msg: 'success' })
    } catch (error) {
        res.status(500).json({ err: 'error', });
    }
}
module.exports = {
    login,
    getMyProfile,
    updateProfile,
    turnOffAutoRenew,
    deleteProfile,
    registerUser,
}