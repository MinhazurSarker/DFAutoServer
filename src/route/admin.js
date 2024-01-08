const express = require('express');
const { createUser, login, updateUser, deleteUser, getUser, getUsers, createAdmin, getMyProfile, updateProfile, deleteProfile } = require('./../controller/v2/admin/userC.js');
const { getSettings, updateSettings, getIndex, getCalculator, } = require('./../controller/v2/admin/settingsC.js');
const { createProduct, updateProduct, getProducts, getProduct, deleteProduct, likeProduct, getDeletedProducts, restoreProduct, deleteProductPermanent } = require('./../controller/v2/admin/productC.js');
const { isUser, isAdmin, isEditor, isAuth } = require('./../middleware/accessControl.js');
const { imgUpload, brandImgUpload } = require('./../middleware/file.js');
const { getBrands, getBrand, createBrand, updateBrand, deleteBrand } = require('../controller/v2/admin/brandC.js');
const { getPlans, getPlan, createPlan, updatePlan, deletePlan } = require('../controller/v2/admin/planC.js');
const { getHistory, deleteHistory, clearHistory } = require('../controller/v2/admin/historyC.js');

const router = express();

router.get('/', function (req, res) {
    res.send('ok')
})
//----------------------------------------------------------------
router.post('/init', createAdmin)
router.post('/login', login)
router.get('/profile', isUser, getMyProfile)
router.post('/profile', isUser, updateProfile)
router.delete('/profile', isUser, deleteProfile)
//----------------------------------------------------------------
router.get('/users', isAdmin, getUsers)
router.post('/users', isAdmin, createUser)
router.get('/user/:userId', isAdmin, getUser)
router.post('/user/:userId', isAdmin, updateUser)
router.delete('/user/:userId', isAdmin, deleteUser)
//----------------------------------------------------------------
router.get('/settings', isEditor, getSettings)
router.get('/calculator', isEditor, getCalculator)
router.post('/settings', isAdmin, updateSettings)
//----------------------------------------------------------------
router.get('/index', isAuth, getIndex)
router.get('/products', isAuth, getProducts)
router.get('/product/:productId', isAuth, getProduct)
router.post('/product/like/:productId', isEditor, likeProduct)
router.post('/products', isEditor, imgUpload, createProduct)
router.post('/product/:productId', isEditor, imgUpload, updateProduct)
router.delete('/product/:productId', isAdmin, deleteProduct)
router.delete('/product/permanent/:productId', isAdmin, deleteProductPermanent)
//----------------------------------------------------------------
router.get('/brands', isAuth, getBrands)
router.get('/brand/:brandId', isEditor, getBrand)
router.post('/brands', isEditor, brandImgUpload, createBrand)
router.post('/brand/:brandId', isEditor, brandImgUpload, updateBrand)
router.delete('/brand/:brandId', isAdmin, deleteBrand)
//----------------------------------------------------------------
router.get('/history/:userId/:page', isEditor, getHistory)
router.delete('/history/:id', isEditor, deleteHistory)
router.delete('/clear/:userId', isEditor, clearHistory)
//----------------------------------------------------------------
router.get('/products/deleted/:page', isEditor, getDeletedProducts)
router.post('/products/restore/:id', isEditor, restoreProduct)

//----------------------------------------------------------------
router.get('/plans', isUser, getPlans)
router.get('/plan/:planId', isAdmin, getPlan)
router.post('/plans', createPlan)
router.post('/plan/:planId', isAdmin, imgUpload, updatePlan)
router.delete('/plan/:planId', isAdmin, deletePlan)

module.exports = router;