const express = require('express');
const { login, getMyProfile, registerUser, updateProfile, deleteProfile, turnOffAutoRenew } = require('./../controller/v2/user/userC.js');
const { getSettings, getIndex, getCalculator, getContacts, } = require('./../controller/v2/user/settingsC.js');
const { getProducts, getProduct, likeProduct, } = require('./../controller/v2/user/productC.js');
const { isUser, isAdmin, isViewer, isApproved, isAuth } = require('./../middleware/accessControl.js');
const { getBrands, } = require('../controller/v2/user/brandC.js');
const { getPlans, getPlan, } = require('../controller/v2/user/planC.js');
const { getHistory, deleteHistory, clearHistory } = require('../controller/v2/user/historyC.js');
const { upgradeAccount, callback, resultMessage } = require('../controller/v2/user/paymentC.js');

const router = express();

router.get('/', function (req, res) {
    res.send('ok')
})
router.post('/login', login)
router.post('/register', registerUser)
router.get('/profile', isUser, getMyProfile)
router.post('/profile', isUser, updateProfile)
router.delete('/profile', isUser, deleteProfile)
router.post('/profile/upgrade/:planId', isUser, upgradeAccount)
router.post('/turn-off-auto-renew', isUser, turnOffAutoRenew)
router.all('/callback/:status', callback)
router.all('/message', resultMessage)
router.all('/contacts', getContacts)

//----------------------------------------------------------------
router.get('/settings', isViewer, getSettings)
router.get('/calculator', isViewer, getCalculator)
//----------------------------------------------------------------
router.get('/home', isAuth, getIndex)
router.get('/products', isAuth, getProducts)
router.get('/borrow/products', isApproved, getProducts)
router.get('/product/:productId', isAuth, getProduct)
router.post('/product/like/:productId', isViewer, likeProduct)



router.get('/brands', isAuth, getBrands)
router.get('/history/:page', isViewer, getHistory)
router.delete('/history/:id', isViewer, deleteHistory)
router.delete('/clear', isViewer, clearHistory)

router.get('/plans', isUser, getPlans)
router.get('/plan/:planId', isAdmin, getPlan)
router.get('/upgrade/:planId', isAuth, getPlan)

module.exports = router;