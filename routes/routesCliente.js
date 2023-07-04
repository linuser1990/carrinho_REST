const express = require('express')
const router = express.Router()
const clienteController = require('../models/clienteModel')

// Rotas para os clientes
router.get('/', clienteController.getAllClientes)

// abre a pagina de cadastro, precisa estar antes porque o express segue a sequecia quem esta primeiro
router.get('/create/', clienteController.showCreateView)

router.get('/:codcli', clienteController.getClienteById)
router.post('/', clienteController.createCliente)
// router.put('/:codcli', clienteController.updateCliente);
router.delete('/:codcli', clienteController.deleteCliente)
router.post('/:codcli', clienteController.updateCliente)

module.exports = router
