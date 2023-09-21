const  express = require('express');
const router = express.Router();
const homecontroller = require('../models/homeModel');
const logincontroller = require('../models/loginModel')
 
// Middleware para autenticação 
router.use(logincontroller.isAuthenticated);

//Middleware para passar usuario logado
router.use(logincontroller.addUserToResponse)

//Rotas Home
router.get('/',homecontroller.redirecionaHome);

module.exports = router;


