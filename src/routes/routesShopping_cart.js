const express = require('express')
const router = express.Router()
const controller = require('../models/shoping_cartModel')

router.get('/',controller.showIndexPage)
router.post('/add',controller.addCart)

module.exports = router

