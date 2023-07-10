const express = require('express')
const routes = express.Router()
const controllerVenda = require('../models/vendaModel')

routes.get('/formVendasPeriodo',controllerVenda.formVendasPeriodo)
routes.get('/detalhesTodasVendas',controllerVenda.detalhesTodasVendas)
routes.get('/detalhesVenda/:codigo',controllerVenda.detalhesVenda)
routes.get('/historicoVendas',controllerVenda.historicoVendas)
routes.get('/estoqueAtual',controllerVenda.estoqueAtual)
routes.get('/addCarrinho',controllerVenda.addCarrinho)
routes.get('/',controllerVenda.showVendaView)
routes.post('/verificaEstoque',controllerVenda.verificaEstoque)
routes.post('/inserirvendacarrinho',controllerVenda.inserirvendacarrinho)
routes.post('/relVendasPeriodo',controllerVenda.relVendasPeriodo)

module.exports = routes
