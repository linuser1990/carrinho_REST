require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const clientesRoutes = require('./src/routes/routesCliente')
const homeRoutes = require('./src/routes/routesHome')
const produtosRoutes = require('./src/routes/routesProduto');
const vendasRoutes = require('./src/routes/routesVenda')
const shopping_cartRoutes = require('./src/routes/routesShopping_cart')
const session = require('express-session');

const app = express()

// Middleware para o parsing do corpo das requisições
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// aceitando EJS
app.set('view engine', 'ejs')

// NECESSARIO PARA USAR O ARQUIVOS DE OUTRA PASTA
// REMOVE ERRO DE MIME TYPE CSS
// NECESSARIO PARA USAR AS IMAGENS DO DIRETORIO 'imagens'
// Defina o diretório de views
app.set('views', path.join(__dirname, 'src/views'))
app.use(express.static(path.join(__dirname, '/')))

// Configuração da sessão
app.use(session({
  secret: 'seu-segredo-aqui',
  resave: false,
  saveUninitialized: true
}));

// Rotas
app.use('/clientes', clientesRoutes)
app.use('/produtos', produtosRoutes);
app.use('/home', homeRoutes)
app.use('/venda', vendasRoutes)
app.use('/shopping_cart',shopping_cartRoutes)

app.get('/', (req, res) => {
  if (!req.session.totalItens) {
    req.session.totalItens = 0;
}
  res.redirect('/home')
})

// Porta em que o servidor irá rodar
const PORT = process.env.PORT

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
