const  express = require('express');
const router = express.Router();
const homecontroller = require('../models/homeModel');
const logincontroller = require('../models/loginModel')

//Rotas Home
router.get('/',logincontroller.isAuthenticated,homecontroller.redirecionaHome);

module.exports = router;


