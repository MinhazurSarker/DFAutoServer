const User = require('./../../model/User.js');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { reverseString } = require('../../utils/utils.js');
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
                res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id } })
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
const createUser = async (req, res) => {
    const roles = ['admin', 'editor', 'viewer'];
    try {
        const u = await User.findOne({ email: req.body.email })
        if (!u) {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const user = await new User({
                name: req.body.name,
                email: req.body.email,
                role: roles.includes(req.body.role) ? (req.body.role).toString() : 'viewer',
                password: hashPassword
            })
            await user.save()
            res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id } })
        } else {
            res.status(403).json({ err: 'userAlreadyExists' })
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
        if (user) {
            const isValid = await bcrypt.compare(req.body.password, user.password)
            if (isValid) {
             
                const payload = {
                    userId: user._id,
                    userName: req.body.password,
                };
                const token = jwt.sign(payload, jwt_secret, {
                    expiresIn: 60 * 60 * 24 * 30 * 6,
                });
                res.status(200).json({ msg: 'success', token: reverseString(token), user: { name: user.name, role: user.role, email: user.email, _id: user._id } })
            } else {
                res.status(401).json({ err: 'invalid' })
            }
        } else {
            res.status(404).json({ err: 'notFound' })

        }
    } catch (error) {
        res.status(500).json({ err: 'something went wrong' })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('_id email role name ');
        res.status(200).json({ msg: 'success', users: users })
    } catch (err) {
        res.status(400).json({ err: 'something went wrong' })

    }
}
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
        if (user) {
            res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id } })
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
        if (user) {
            res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id } })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (err) {
        res.status(400).json({ err: err })
    }
}
const updateUser = async (req, res) => {
    const roles = ['admin', 'editor', 'viewer'];
    try {
        const user = await User.findOne({ _id: req.params.userId })
        if (user) {
            const hashPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
            user.name = req.body.name;
            user.email = req.body.email;
            user.role = roles.includes(req.body.role) ? (req.body.role).toString() : 'viewer';
            user.password = hashPassword
            await user.save().then(() => {
                res.status(200).json({ msg: 'success', user: { name: user.name, role: user.role, email: user.email, _id: user._id } })
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
module.exports = {
    createAdmin,
    createUser,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getMyProfile,
}