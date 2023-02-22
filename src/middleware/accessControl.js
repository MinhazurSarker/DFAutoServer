const jwt = require('jsonwebtoken');
const User = require('./../model/User');
const dotenv = require("dotenv");
dotenv.config();
const jwt_secret = process.env.JWT_SECRET || '';

const isViewer = async (req, res, next) => {
    const token = req.headers.token || req.cookies.token || req.query.token;
    try {
        if (token) {
            const id = jwt.verify(token, jwt_secret, (err, decoded) => {
                return decoded.userId;
            });
            const user = await User.findOne({ _id: id })
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
                    res.status(403).json({ msg: 'Unauthorized' })
                }
            } else {
                res.status(403).json({ msg: 'Invalid token' })
            }
        } else {
            res.status(403).json({ msg: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
const isEditor = async (req, res, next) => {
    const token = req.headers.token || req.cookies.token || req.query.token;
    try {
        if (token) {
            const id = jwt.verify(token, jwt_secret, (err, decoded) => {
                return decoded.userId;
            });
            const user = await User.findOne({ _id: id })
            if (user) {
                if (['admin', 'editor'].includes(user.role)) {
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
                res.status(403).json({ msg: 'Invalid token' })
            }
        } else {
            res.status(403).json({ msg: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
const isAdmin = async (req, res, next) => {
    const token = req.headers.token || req.cookies.token || req.query.token;
    try {
        if (token) {
            const id = jwt.verify(token, jwt_secret, (err, decoded) => {
                return decoded.userId;
            });
            const user = await User.findOne({ _id: id })
            if (user) {
                if (['admin'].includes(user.role)) {
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
                res.status(403).json({ msg: 'Invalid token' })
            }
        } else {
            res.status(403).json({ msg: 'Need To Login' })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
module.exports = {
    isViewer,
    isEditor,
    isAdmin,
}