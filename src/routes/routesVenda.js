const express = require('express')
const router = express.Router()
const controllerVenda = require('../models/vendaModel')
const logincontroller = require('../models/loginModel')
 
// Middleware para autenticação 
router.use(logincontroller.isAuthenticated);

//Middleware para passar usuario logado
router.use(logincontroller.addUserToResponse)

router.get('/formProdutosMaisVendidosPeriodo',controllerVenda.formProdutosMaisVendidosPeriodo)
router.get('/verificaPrecoVenda',controllerVenda.verificaPrecoVenda)
router.get('/removeDoCarrinho',controllerVenda.removeDoCarrinho)
router.get('/testelista',controllerVenda.testeLista)
router.get('/pesquisaRadioAntigas',controllerVenda.pesquisaRadioAntigas)
router.get('/formMaioresVendasPeriodo',controllerVenda.formMaioresVendasPeriodo)
router.get('/formVendasPeriodo',controllerVenda.formVendasPeriodo)
router.get('/detalhesTodasVendas',controllerVenda.detalhesTodasVendas)
router.get('/detalhesVenda/:codigo',controllerVenda.detalhesVenda)
router.get('/historicoVendas',controllerVenda.historicoVendas)
router.get('/estoqueAtual',controllerVenda.estoqueAtual)
router.get('/addCarrinho',controllerVenda.addCarrinho)
router.get('/',controllerVenda.showVendaView)
router.post('/verificaEstoque',controllerVenda.verificaEstoque)
router.post('/inserirvendacarrinho',controllerVenda.inserirvendacarrinho)
router.post('/relVendasPeriodo',controllerVenda.relVendasPeriodo)
router.post('/relMaioresVendasPeriodo',controllerVenda.relMaioresVendasPeriodo)
router.post('/relProdutosMaisVendidosPeriodo',controllerVenda.relProdutosMaisVendidosPeriodo)

module.exports = router
