const pool = require('../db/db')
var listaDeObjetos = []
var total = 7

const addCart = async (req, res) => {
    const {codpro} = req.body
    const {rows} = await pool.query('SELECT * FROM produto WHERE codpro = $1',[codpro])
    var achou = false
    for (var i=0; i<listaDeObjetos.length; i++) {
        if(codpro === listaDeObjetos[i].codpro) {
            achou = true
            break
        } else {
            achou = false
        }
    }

    if(achou) {
        listaDeObjetos[i].qtd = parseInt(listaDeObjetos[i].qtd) + 1
        listaDeObjetos[i].subtotal = parseFloat(listaDeObjetos[i].subtotal) + parseFloat(rows[0].precovenda)
        console.log(listaDeObjetos[i].qtd)
        console.log(listaDeObjetos[i].subtotal)
    } else {
        adicionarObjeto(codpro, rows[0].nome,rows[0].descricao,1,rows[0].precovenda)
    }
    res.status(200).send(listaDeObjetos) 
}

const showIndexPage = async (req, res) => {
    const {rows} = await pool.query('select * from produto order by nome')
    res.render('./shopping_cart/index',{title: 'NodeJS Shopping Cart', produto: rows})
        
}

  
// LISTA DE ITENS ADICIONADOS, QUE APARECE NA TELA PRINCIPAL
function adicionarObjeto (codpro, nome,descricao,qtd,subtotal) {
  const novoObjeto = {
    codpro,
    nome,
    descricao,
    qtd,
    subtotal
  }

listaDeObjetos.push(novoObjeto)
}

module.exports = {
    showIndexPage,
    addCart,
    listaDeObjetos
}