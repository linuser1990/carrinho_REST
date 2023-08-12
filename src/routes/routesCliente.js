const express = require('express')
const router = express.Router()
const clienteController = require('../models/clienteModel')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/',clienteController.getAllClientes)// Rotas para os clientes
router.get('/create/', clienteController.showCreateView)// abre a pagina de cadastro, precisa estar antes porque o express segue a sequecia quem esta primeiro
router.get('/formClienteMaisComprou',clienteController.formClienteMaisComprou)
router.get('/:codcli', clienteController.getClienteById)
router.delete('/:codcli', clienteController.deleteCliente)
router.put('/:codcli', clienteController.updateCliente);
router.post('/', clienteController.createCliente)
router.post('/relClienteMaisComprouPeriodo',clienteController.relClienteMaisComprouPeriodo)

module.exports = router
