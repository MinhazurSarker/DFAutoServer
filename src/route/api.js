const express = require('express');
const { createUser, login, updateUser, deleteUser, getUser, getUsers, createAdmin, getMyProfile } = require('./../controller/userC.js');
const { getSettings, updateSettings, getIndex, } = require('./../controller/settingsC.js');
const { createProduct, updateProduct, getProducts, getProduct, deleteProduct } = require('./../controller/productC.js');
const { isAdmin, isEditor, isViewer } = require('./../middleware/accessControl.js');
const { imgUpload } = require('./../middleware/file.js');

const router = express();

router.get('/', function (req, res) {
    res.send('ok')
})
router.post('/init', createAdmin)
router.post('/login', login)
router.get('/profile', isViewer, getMyProfile)
//----------------------------------------------------------------
router.get('/users', isAdmin, getUsers)
router.post('/users', isAdmin, createUser)
router.get('/user/:userId', isAdmin, getUser)
router.post('/user/:userId', isAdmin, updateUser)
router.delete('/user/:userId', isAdmin, deleteUser)
//----------------------------------------------------------------
router.get('/settings', isAdmin, getSettings)
router.post('/settings', isAdmin, updateSettings)
//----------------------------------------------------------------
router.get('/home', isViewer, getIndex)
router.get('/products', isViewer, getProducts)
router.get('/product/:productId', isViewer, getProduct)
router.post('/products', isEditor, imgUpload, createProduct)
router.post('/product/:productId', isEditor, imgUpload, updateProduct)
router.delete('/product/:productId', isAdmin, deleteProduct)

module.exports = router;