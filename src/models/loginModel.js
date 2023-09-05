const pool = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Chave secreta para JWT (guarde em local seguro em uma aplicação real)
const secretKey = 'secreto';

const showViewLogin = async (req, res) => {
  // Verifica se já está autenticado, e se sim, redireciona para a página inicial
  if (req.session.username) {
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
                req.session.token = token
                res.status(200).json({ success: true, user: req.session.username, token: req.session.token});
                //res.redirect(`/home?token=${token}`)
                // res.render('./home/index',{user: req.session.username, token: token})

            } else {
                console.log('Senha incorreta.');
                res.json({success: false, message: 'Senha incorreta.'})
            }
        } else {
            console.log('Usuário não encontrado.');

            res.json({success: false, message: 'Usuário não encontrado'})
           //res.redirect('/login')
        }
  } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
  }

}

const isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    // O usuário está autenticado, siga para a próxima rota
    next();
  } else {
    // O usuário não está autenticado, redirecione para a página de login
    res.redirect('/login');
  }
};

const logoutAccount = async (req, res) => {
  req.session.username = null
  res.redirect('/login')
}

module.exports = {
  showViewLogin,
  validaLogin,
  isAuthenticated,
  logoutAccount
 
}
