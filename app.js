require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const clientesRoutes = require('./routes/routesCliente')
const homeRoutes = require('./routes/routesHome')
const produtosRoutes = require('./routes/routesProduto');
const vendasRoutes = require('./routes/routesVenda')
const shopping_cartRoutes = require('./routes/routesShopping_cart')

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
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '/')))

// Rotas
app.use('/clientes', clientesRoutes)
app.use('/produtos', produtosRoutes);
app.use('/home', homeRoutes)
app.use('/venda', vendasRoutes)
app.use('/shopping_cart',shopping_cartRoutes)

app.get('/', (req, res) => {
  res.redirect('/home')
})

// Porta em que o servidor irá rodar
const PORT = process.env.PORT

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
