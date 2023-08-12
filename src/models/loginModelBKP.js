const pool = require('../db/db')
const jwt = require('jsonwebtoken')

// Definir uma chave privada para o jsonwebtoken
const chavePrivada = 'consolelog.com.br'

const showViewLogin = async (req, res) => {
  res.render('./Login_v1/index')
}

const validaLogin = async (req, res) => {
  const { usuario, senha } = req.body

  // Validar as credenciais (aqui você pode usar sua própria lógica ou consultar um banco de dados)
  if (usuario === 't' && senha === 't') {
    res.redirect('/home'); 
  }
}

module.exports = {
  showViewLogin,
  validaLogin,
 
}
