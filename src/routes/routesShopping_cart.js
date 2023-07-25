const express = require('express')
const router = express.Router()
const controller = require('../models/shoping_cartModel')

router.get('/',controller.showIndexPage)

module.exports = router

