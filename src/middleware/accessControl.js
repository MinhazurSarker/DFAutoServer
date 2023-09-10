const jwt = require('jsonwebtoken');
const User = require('./../model/User.js');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { reverseString } = require('../utils/utils.js');

dotenv.config();
const jwt_secret = process.env.JWT_SECRET || '';
const isAuth = async (req, res, next) => {
    const t = req.headers.token || req.cookies.token || req.query.token;
    const token = reverseString(t)
    try {
        if (token) {
            const decoded = await jwt.verify(token, jwt_secret)
            if (typeof decoded === 'string') return res.status(403).json({ msg: 'Invalid token' })

            const userId = decoded.userId;
            const passChangeTime = decoded.passChangeTime;
            const deviceModel = decoded.deviceModel;
            const deviceUniqueId = decoded.deviceUniqueId;
            const userRole = decoded.userRole;
            const user = await User.findOne({ _id: userId, role: userRole, passChangeTime: passChangeTime, deviceModel: deviceModel, deviceUniqueId: deviceUniqueId })
            if (user) {
                if (['admin', 'editor', 'viewer', 'user'].includes(user.role)) {
                    req.body.requesterId = user._id;
                    req.body.requesterRole = user.role;
                    req.params.requesterId = user._id;
                    req.params.requesterRole = user.role;
                    req.query.requesterId = user._id;
                    req.query.requesterRole = user.role;
                    next()
                } else {
                    next()
                }

            } else {
                next()
            }
        } else {
            next()
        }
    } catch (err) {
        next()
    }
}
const isUser = async (req, res, next) => {
    const t = req.headers.token || req.cookies.token || req.query.token;
    const token = reverseString(t)
    try {
        if (token) {
            const decoded = await jwt.verify(token, jwt_secret)
            if (typeof decoded === 'string') return res.status(403).json({ msg: 'Invalid token' })

            const userId = decoded.userId;
            const passChangeTime = decoded.passChangeTime;
            const deviceModel = decoded.deviceModel;
            const deviceUniqueId = decoded.deviceUniqueId;
            const userRole = decoded.userRole;
            const user = await User.findOne({ _id: userId, role: userRole, passChangeTime: passChangeTime, deviceModel: deviceModel, deviceUniqueId: deviceUniqueId })
            if (user) {
                if (['admin', 'editor', 'viewer', 'user'].includes(user.role)) {
                    req.body.requesterId = user._id;
                    req.body.requesterRole = user.role;
                    req.params.requesterId = user._id;
                    req.params.requesterRole = user.role;
                    req.query.requesterId = user._id;
                    req.query.requesterRole = user.role;
                    next()
                } else {
                    res.status(403).json({ err: 'Unauthorized' })
                }

            } else {
                res.status(200).json({ err: 'Need To Login' })
            }
        } else {
            res.status(200).json({ err: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
const isViewer = async (req, res, next) => {
    const t = req.headers.token || req.cookies.token || req.query.token;
    const token = reverseString(t)
    try {
        if (token) {
            const decoded = await jwt.verify(token, jwt_secret)
            if (typeof decoded === 'string') return res.status(403).json({ msg: 'Invalid token' })

            const userId = decoded.userId;
            const passChangeTime = decoded.passChangeTime;
            const deviceModel = decoded.deviceModel;
            const deviceUniqueId = decoded.deviceUniqueId;
            const userRole = decoded.userRole;

            const user = await User.findOne({ _id: userId, role: userRole, passChangeTime: passChangeTime, deviceModel: deviceModel, deviceUniqueId: deviceUniqueId })
            if (user) {
                if (['admin', 'editor', 'viewer'].includes(user.role)) {
                    req.body.requesterId = user._id;
                    req.body.requesterRole = user.role;
                    req.params.requesterId = user._id;
                    req.params.requesterRole = user.role;
                    req.query.requesterId = user._id;
                    req.query.requesterRole = user.role;
                    next()
                } else {
                    res.status(403).json({ err: 'Unauthorized' })
                }

            } else {
                res.status(200).json({ err: 'Need To Login' })
            }
        } else {
            res.status(200).json({ err: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
const isEditor = async (req, res, next) => {
    const t = req.headers.token || req.cookies.token || req.query.token;
    const token = reverseString(t)
    try {
        if (token) {
            const decoded = await jwt.verify(token, jwt_secret)
            if (typeof decoded === 'string') return res.status(403).json({ msg: 'Invalid token' })

            const userId = decoded.userId;
            const passChangeTime = decoded.passChangeTime;
            const deviceModel = decoded.deviceModel;
            const deviceUniqueId = decoded.deviceUniqueId;
            const userRole = decoded.userRole;

            const user = await User.findOne({ _id: userId, role: userRole, passChangeTime: passChangeTime, deviceModel: deviceModel, deviceUniqueId: deviceUniqueId })
            if (user) {
                if (['admin', 'editor',].includes(user.role)) {
                    req.body.requesterId = user._id;
                    req.body.requesterRole = user.role;
                    req.params.requesterId = user._id;
                    req.params.requesterRole = user.role;
                    req.query.requesterId = user._id;
                    req.query.requesterRole = user.role;
                    next()
                } else {
                    res.status(403).json({ err: 'Unauthorized' })
                }

            } else {
                res.status(200).json({ err: 'Need To Login' })
            }
        } else {
            res.status(200).json({ err: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
const isAdmin = async (req, res, next) => {
    const t = req.headers.token || req.cookies.token || req.query.token;
    const token = reverseString(t)
    try {
        if (token) {
            const decoded = await jwt.verify(token, jwt_secret)
            if (typeof decoded === 'string') return res.status(403).json({ msg: 'Invalid token' })

            const userId = decoded.userId;
            const passChangeTime = decoded.passChangeTime;
            const deviceModel = decoded.deviceModel;
            const deviceUniqueId = decoded.deviceUniqueId;
            const userRole = decoded.userRole;

            const user = await User.findOne({ _id: userId, role: userRole, passChangeTime: passChangeTime, deviceModel: deviceModel, deviceUniqueId: deviceUniqueId })
            if (user) {
                if (['admin',].includes(user.role)) {
                    req.body.requesterId = user._id;
                    req.body.requesterRole = user.role;
                    req.params.requesterId = user._id;
                    req.params.requesterRole = user.role;
                    req.query.requesterId = user._id;
                    req.query.requesterRole = user.role;
                    next()
                } else {
                    res.status(403).json({ msg: 'Unauthorized' })
                }

            } else {
                res.status(403).json({ msg: 'Need To Login' })
            }
        } else {
            res.status(403).json({ msg: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
const isApproved = async (req, res, next) => {
    const t = req.headers.token || req.cookies.token || req.query.token;
    const token = reverseString(t)
    try {
        if (token) {
            if (token == jwt_secret) {
                next()
            } else {
                res.status(403).json({ msg: 'Invalid token' })
            }
        } else {
            res.status(200).json({ err: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
module.exports = {
    isAuth,
    isUser,
    isViewer,
    isEditor,
    isAdmin,
    isApproved
}