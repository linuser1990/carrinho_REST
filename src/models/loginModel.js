const pool = require('../db/db')
const jwt = require('jsonwebtoken')


// Chave secreta para JWT (guarde em local seguro em uma aplicação real)
const secretKey = 'secreto';

const showViewLogin = async (req, res) => {
  // Verifica se já está autenticado, e se sim, redireciona para a página inicial
  if (req.user) {
     return res.redirect('/home');
  }
  res.render('./Login_v1/index')
}

const validaLogin = async (req, res) => {
  const { usuario, senha } = req.body
  

  // Validar as credenciais (aqui você pode usar sua própria lógica ou consultar um banco de dados)
  if (usuario === 't' && senha === 't') {
    const dadosUsuario = {
      nome: 'marcelo',
      email: 'teste@gmail.com',
      id: 1
    }

    const token = jwt.sign({ username: dadosUsuario.nome}, secretKey)
    res.redirect(`/home?token=${token}`)
  } else {
    
    res.redirect('/login')
  }
}

module.exports = {
  showViewLogin,
  validaLogin,
 
}
