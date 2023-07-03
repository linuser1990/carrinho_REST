const  express = require('express');
const router = express.Router();
const homecontroller = require('../models/homeModel');

//Rotas Home
router.get('/',homecontroller.redirecionaHome);

module.exports = router;


