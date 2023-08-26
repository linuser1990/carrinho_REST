const pool = require('../db/db')

const getAllProdutos = async (req, res) => {
  try {
    const { rows } = await pool.query('select * from produto order by nome')
    res.render('./produto/index', { produtos: rows , user : req.session.username})
  } catch (error) {
    console.log(error)
  }
}

const getProdutoById = async (req, res) => {
  try {
    const { codpro } = req.params
    const { rows } = await pool.query('select * from produto where codpro = $1', [codpro])
    res.render('./produto/edit', { produto: rows })
  } catch (error) {

  }
}

const createProduto = async (req, res) => {
  try {
    const { nome, precocusto, precovenda, estoque, descricao} = req.body
    const { rows } = await pool.query('INSERT INTO produto (nome,precocusto,precovenda,estoque,descricao)' +
      ' values ($1,$2,$3,$4,$5)', [nome, precocusto, precovenda, estoque,descricao])
    res.redirect('/produtos')
  } catch (error) {
    console.log(error)
  }
}

const updateProduto = async (req, res) => {
  try {
    const { codpro } = req.params
    const { nome, descricao,  precocusto, precovenda, estoque} = req.body
    const { rows } = await pool.query('UPDATE produto set nome = $1,descricao = $2, precocusto = $3,' +
      ' precovenda=$4, estoque = $5 where codpro = $6', [nome, descricao, precocusto, precovenda, estoque, codpro])
    res.redirect('/produtos')
  } catch (error) {
    console.log(error)
  }
}

const deleteProduto = async (req, res) =>{
  try {
    const { codpro } = req.params

    const { rows } = await pool.query("DELETE FROM produto WHERE codpro = $1 RETURNING *",[codpro])
    
    if (rows.length > 0) {
      res.json({ message: 'Produto excluído com sucesso' })
    } 

  } catch(error){
    console.log(error)
  }
}

const showCreateView = async (req, res) => {
  try {
    res.render('./produto/create')
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllProdutos,
  getProdutoById,
  showCreateView,
  createProduto,
  updateProduto,
  deleteProduto
}
