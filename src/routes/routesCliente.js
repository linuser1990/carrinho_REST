const express = require('express')
const router = express.Router()
const clienteController = require('../models/clienteModel')
const logincontroller = require('../models/loginModel')
 

router.get('/',logincontroller.isAuthenticated,clienteController.getAllClientes)// Rotas para os clientes
router.get('/create/',logincontroller.isAuthenticated, clienteController.showCreateView)// abre a pagina de cadastro, precisa estar antes porque o express segue a sequecia quem esta primeiro
router.get('/formClienteMaisComprou',clienteController.formClienteMaisComprou)
router.get('/:codcli',logincontroller.isAuthenticated, clienteController.getClienteById)
router.delete('/:codcli', logincontroller.isAuthenticated,clienteController.deleteCliente)
router.put('/:codcli',logincontroller.isAuthenticated, clienteController.updateCliente);
router.post('/', logincontroller.isAuthenticated,clienteController.createCliente)
router.post('/relClienteMaisComprouPeriodo',logincontroller.isAuthenticated,clienteController.relClienteMaisComprouPeriodo)

module.exports = router
