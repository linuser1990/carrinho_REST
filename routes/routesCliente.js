const express = require('express');
const router = express.Router();
const clienteController = require('../models/clienteModel');

// Rotas para os clientes
router.get('/', clienteController.getAllClientes);
router.get('/:codcli', clienteController.getClienteById);
router.post('/', clienteController.createCliente);
router.put('/:codcli', clienteController.updateCliente);
router.delete('/:codcli', clienteController.deleteCliente);

module.exports = router;
