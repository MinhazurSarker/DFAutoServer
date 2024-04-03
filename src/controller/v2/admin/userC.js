const User = require('./../../../model/User.js');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { reverseString } = require('../../../utils/utils.js');
const ExchangeRate = require('../../../model/ExchangeRate.js');
dotenv.config();

const jwt_secret = process.env.JWT_SECRET || '';
const createAdmin = async (req, res) => {
    try {
        if (req.headers.secret === jwt_secret) {
            const u = await User.findOne({ email: req.body.email })
            if (!u) {
                const hashPassword = await bcrypt.hash(req.body.password, 10);
                const user = await new User({
                    name: req.body.name,
                    email: req.body.email,
                    role: 'admin',
                    password: hashPassword
                })
                await user.save()
                res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id, currency: user.currency } })
            } else {
                res.status(403).json({ msg: 'userAlreadyExists' })
            }
        } else {
            res.status(403).json({ msg: 'Unauthorized' })
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
        console.log(req.body)
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
                res.status(200).json({ msg: 'success', token: reverseString(token), user: { name: user.name, role: user.role, email: user.email, _id: user._id, currency: user.currency } })
            } else {
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
const createUser = async (req, res) => {
    const roles = ['admin', 'editor', 'viewer', 'user'];
    try {
        const u = await User.findOne({ email: req.body.email })
        if (!u) {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const user = await new User({
                name: req.body.name,
                email: req.body.email,
                currency: req.body.currency,
                subEnd: req.body.subEnd,
                infinity: req.body.isInfinity,
                discount: req.body.discount,
                role: roles.includes(req.body.role) ? (req.body.role).toString() : 'user',
                passChangeTime: Date.now(),
                password: hashPassword
            })
            await user.save()
            res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id, currency: user.currency } })
        } else {
            res.status(403).json({ err: 'userAlreadyExists' })
        }
    } catch (error) {
        res.status(500).json({ err: 'something went wrong' })
    }
}
const getUsers = async (req, res) => {
    try {
        const page = req.query.page
        const search = req.query.search
        const totalDocs = await User.countDocuments({ role: req.query.tab || 'user' });
        const pages = Math.ceil(totalDocs / 25)
        const users = await User.find({ email: { $regex: search, $options: "i" }, role: req.query.tab || 'user' })
            .select('_id email role name ')
            .sort({ createdAt: -1 })
            .skip(25 * (page - 1))
            .limit(25)

        res.status(200).json({ msg: 'success', users: users, current: page, pages: pages })
    } catch (err) {
        res.status(400).json({ err: 'something went wrong' })

    }
}
const getUser = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.params.userId })
        const exchangeRates = await ExchangeRate.findOne();
        const rates = exchangeRates?.rates;
        if (user && rates && typeof rates == 'object') {
            res.status(200).json({ msg: 'success', user: user, currencies: Object.keys(rates) })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (err) {
        res.status(400).json({ err: err })
    }
}
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.requesterId })
        const exchangeRates = await ExchangeRate.findOne();
        const rates = exchangeRates?.rates;
        if (user && rates && typeof rates == 'object') {
            res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id, currency: user.currency, discount: user.discount }, currencies: Object.keys(rates) })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (err) {
        res.status(400).json({ err: err })
    }
}
const updateUser = async (req, res) => {
    const roles = ['admin', 'editor', 'viewer', 'user'];
    try {
        const user = await User.findOne({ _id: req.params.userId })
        if (user) {
            const hashPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
            user.name = req.body.name;
            user.email = req.body.email;
            user.currency = req.body.currency;
            user.subEnd = req.body.subEnd;
            user.infinity = req.body.isInfinity;
            user.discount = req.body.discount;
            user.role = roles.includes(req.body.role) ? (req.body.role).toString() : 'user';
            user.passChangeTime = req.body.password ? Date.now() : user.passChangeTime;
            user.password = hashPassword
            await user.save().then(() => {
                res.status(200).json({ msg: 'success', user: { name: user?.name, role: user?.role, email: user?.email, _id: user?._id, currency: user?.currency } })
            }).catch(err => {
                res.status(404).json({ err: 'notFound', })
            })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ err: err })
    }
}
const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.userId });
        res.status(200).json({ msg: 'success' })
    } catch (err) {
        console.log(err)
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
            res.status(200).json({ msg: 'success', token: reverseString(token), user: { name: user.name, role: user.role, email: user.email, _id: user._id, currency: user.currency } })
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
    createAdmin,
    createUser,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getMyProfile,
    updateProfile,
    deleteProfile,
}