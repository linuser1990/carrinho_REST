const express = require('express')
const router = express.Router()
const controller = require('../models/loginModel')
 

router.get('/',controller.showViewLogin)
router.post('/',controller.validaLogin)


module.exports = router