require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const clientesRoutes = require('./routes/routesCliente');
//const produtosRoutes = require('./routes/routesProduto');


const app = express();

// Middleware para o parsing do corpo das requisições
app.use(bodyParser.json());

//aceitando EJS
app.set('view engine', 'ejs');
//app.set('views', './views');
 

// Defina o diretório de views
app.set('views', path.join(__dirname, 'views'));


// Rotas
app.use('/clientes', clientesRoutes);
//app.use('/produtos', produtosRoutes);


// Porta em que o servidor irá rodar
const PORT = process.env.PORT;

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
