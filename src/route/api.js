const express = require('express');
const { createUser, login, updateUser, deleteUser, getUser, getUsers } = require('../controller/userC');
const { getSettings, updateSettings, } = require('../controller/settingsC');
const router = express();
router.get('/', function (req, res) {
    res.send('ok')
})
router.post('/login', login)
router.get('/users', getUsers)
router.post('/users', createUser)
router.get('/user/:userId', getUser)
router.post('/user/:userId', updateUser)
router.delete('/user/:userId', deleteUser)
router.get('/settings', getSettings)
router.post('/settings', updateSettings)

module.exports = router;