const express = require('express')
const router = express.Router()
const clienteController = require('../models/clienteModel')
const logincontroller = require('../models/loginModel')
 

// Middleware para autenticação 
router.use(logincontroller.isAuthenticated);

// Rotas para os clientes
router.get('/', clienteController.getAllClientes);
router.get('/create/', clienteController.showCreateView);
router.get('/formClienteMaisComprou', clienteController.formClienteMaisComprou);
router.get('/:codcli', clienteController.getClienteById);
router.delete('/:codcli', clienteController.deleteCliente);
router.put('/:codcli', clienteController.updateCliente);
router.post('/', clienteController.createCliente);
router.post('/relClienteMaisComprouPeriodo', clienteController.relClienteMaisComprouPeriodo);

module.exports = router;
