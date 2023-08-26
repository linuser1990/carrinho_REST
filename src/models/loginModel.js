const pool = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
  const { email, senha } = req.body

  const query = {
        text: 'SELECT * FROM cliente WHERE email = $1',
        values: [email],
  }

  try {
      const result = await pool.query(query);
      if (result.rows.length === 1) {
            const cliente = result.rows[0];
            const passwordMatch = await bcrypt.compare(senha, cliente.senha);
            if (passwordMatch) {

                console.log('Autenticação bem-sucedida!');

                const dadosUsuario = {
                  nome: cliente.nome,
                  email: cliente.email,
                  id: 1
                }

                const token = jwt.sign({ username: dadosUsuario.nome}, secretKey)
                req.session.username = dadosUsuario.nome
                //res.redirect(`/home?token=${token}`)
                res.render('./home/index',{user: req.session.username})

            } else {
                console.log('Senha incorreta.');
            }
        } else {
            console.log('Usuário não encontrado.');
            res.redirect('/login')
        }
  } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
  }

}

module.exports = {
  showViewLogin,
  validaLogin,
 
}
