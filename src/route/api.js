const express = require('express');
const { createUser, login, updateUser, deleteUser, getUser, getUsers, createAdmin } = require('./../controller/userC');
const { getSettings, updateSettings, } = require('./../controller/settingsC');
const { isAdmin, isEditor, isViewer } = require('./../middleware/accessControl');
const { imgUpload } = require('./../middleware/file');

const { createProduct, updateProduct, getProducts, getProduct, deleteProduct } = require('./../controller/productC');
const router = express();
router.get('/', function (req, res) {
    res.send('ok')
})
router.post('/init', createAdmin)
router.post('/login', login)
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
router.get('/products', isViewer, imgUpload, getProducts)
router.get('/product/:productId', isViewer, imgUpload, getProduct)
router.post('/products', isEditor, imgUpload, createProduct)
router.post('/product/:productId', isEditor, imgUpload, updateProduct)
router.delete('/product/:productId', isEditor, imgUpload, deleteProduct)

module.exports = router;