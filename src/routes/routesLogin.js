const express = require('express')
const router = express.Router()
const controller = require('../models/loginModel')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/',authMiddleware,controller.showViewLogin)
router.post('/',controller.validaLogin)


module.exports = router