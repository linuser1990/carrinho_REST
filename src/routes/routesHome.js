const  express = require('express');
const router = express.Router();
const homecontroller = require('../models/homeModel');
const authMiddleware = require('../middleware/authMiddleware'); // Importe o middleware

//Rotas Home
router.get('/', authMiddleware, homecontroller.redirecionaHome);

module.exports = router;


