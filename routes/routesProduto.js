const express = require('express')
const router = express.Router()
const produtoController = require('../models/produtoModel')

router.get('/',produtoController.getAllProdutos)
router.get('/create',produtoController.showCreateView)
router.post('/updateProduto/:codpro',produtoController.updateProduto)
router.get('/:codpro',produtoController.getProdutoById)
router.post('/',produtoController.createProduto)
router.delete('/:codpro',produtoController.deleteProduto)



module.exports = router;
 