const express = require('express')
const router = express.Router()
const produtoController = require('../models/produtoModel')

router.get('/',produtoController.getAllProdutos)

module.exports = router;
 