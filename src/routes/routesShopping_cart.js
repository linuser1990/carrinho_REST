const express = require('express')
const router = express.Router()
const controller = require('../models/shoping_cartModel')

router.get('/',controller.showIndexPage)
router.post('/add',controller.addCart)
router.get('/cart',controller.showCartView)
router.get('/updateItensCart',controller.updateItensCart)
router.get('/removeProductCart/:codpro',controller.removeProductCart)

module.exports = router

