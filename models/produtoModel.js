const pool = require('../db/db')

const getAllProdutos = async (req, res) => {
  try {
    const { rows } = await pool.query('select * from produto order by nome')
    res.render('./produto/index', { produtos: rows })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllProdutos
}
