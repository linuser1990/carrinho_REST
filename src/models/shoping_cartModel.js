const pool = require('../db/db')
var shoppingCart = []

const addCart = async (req, res) => {
    const {codpro}= req.body
    console.log(codpro)
    res.send(codpro)
}

const showIndexPage = async (req, res) => {
    const {rows} = await pool.query('select * from produto order by nome')
    res.render('./shopping_cart/index',{title: 'NodeJS Shopping Cart', produto: rows})
    
}

module.exports = {
    showIndexPage,
    addCart
}