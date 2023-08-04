const pool = require('../db/db')
var listaDeObjetos = []
var total = 0

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
        //ALTERA OS VALORES NA POSIÇÃO [i]  QUE PAROU O ARRAY
        listaDeObjetos[i].qtd = parseInt(listaDeObjetos[i].qtd) + 1
        listaDeObjetos[i].subtotal = parseFloat(listaDeObjetos[i].subtotal) + parseFloat(rows[0].precovenda)
        
    } else {
        adicionarObjeto(codpro, rows[0].nome,rows[0].descricao,1,rows[0].precovenda)
    }
    if (isNaN(req.session.totalItens)) {
        req.session.totalItens = 1
    } else {
        req.session.totalItens++
    }
    total = parseFloat(total) + parseFloat(rows[0].precovenda)
 
    req.session.total = total

    //RESPONDE A listaDeObjetos e tambem a req.session.totalItens 
    //para atualizar no frontend o elemento Cart()
    res.json({listaDeObjetos: listaDeObjetos,totalItens: req.session.totalItens})
}

const showIndexPage = async (req, res) => {
    const {rows} = await pool.query('select * from produto order by nome')
    res.render('./shopping_cart/index',{lista: listaDeObjetos,totalItensSession: req.session.totalItens,title: 'NodeJS Shopping Cart', produto: rows})
        
}

const showCartView = async (req, res) => {
    res.render('./shopping_cart/cart',{lista: listaDeObjetos,totalItensSession: req.session.totalItens,totalGeral: req.session.total})
}

const updateItensCart = async (req, res) => {
    const qtdItens = req.body
    req.session.totalItens = qtdItens
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
    showCartView,
    updateItensCart,
    listaDeObjetos
}