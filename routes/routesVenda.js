const express = require('express')
const routes = express.Router()
const controllerVenda = require('../models/vendaModel')

routes.get('/estoqueAtual',controllerVenda.estoqueAtual)
routes.get('/addCarrinho',controllerVenda.addCarrinho)
routes.get('/',controllerVenda.showVendaView)
routes.post('/verificaEstoque',controllerVenda.verificaEstoque)
routes.post('/inserirvendacarrinho',controllerVenda.inserirvendacarrinho)

module.exports = routes
