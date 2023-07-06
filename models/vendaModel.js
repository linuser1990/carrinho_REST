const pool = require('../db/db')

// Criação do array vazio para armazenar os objetos
const listaDeObjetos = []

// VARIAVEL QUE ARMAZENA O TOTAL GERAL
let total = 0.0

const showVendaView = async (req, res) => {
  try {
    const rowsCli = await pool.query('SELECT * FROM cliente')
    const rowsPro = await pool.query('SELECT * FROM produto')
    res.render('./venda/create', { clientes: rowsCli.rows, produtos: rowsPro.rows })
  } catch (error) {
    console.log(error)
  }
}

const verificaEstoque = async (req, res) => {
  const { codpro, qtd } = req.body
  const { rows } = await pool.query('SELECT estoque FROM produto WHERE codpro = $1', [codpro])
  if (rows[0].estoque > [qtd]) {
    res.send('maior')
  } else {
    res.send('menor')
  }
}

const estoqueAtual = async (req, res) => {
  const codpro = req.query.codpro
  const { rows } = await pool.query('SELECT estoque FROM produto WHERE codpro = $1', [codpro])
  res.send(rows[0])
}

const addCarrinho = async (req, res) => {
  try {
    // recebe os parametros da URL
    const codcliente = req.query.codcli
    const codproduto = req.query.codpro
    const quantidade = req.query.qtd
    const stotal = req.query.subtotal

    // Função para adicionar um novo objeto ao array
    function adicionarObjeto (codcli, codpro, qtd, subtotal) {
      const novoObjeto = {
        codcli,
        codpro,
        qtd,
        subtotal
      }

      listaDeObjetos.push(novoObjeto)
    }

    // VARRE A LISTA PRA VER SE JA FOI ADICIONADO O PRODUTO
    for (let i = 0; i < listaDeObjetos.length; i++) {
      const objeto = listaDeObjetos[i]

      /// VERIFICA SE ACHOU O PRODUTO NA LISTA
      var achou = 1

      if (codproduto == objeto.codpro) {
        // 2 = ENCONTROU
        achou = 2
        res.json({ mensagem: 'PRODUTO JA ADICIONADO', encontrou: 2 })
        break
      }
    }

    if (achou == 2) {
      // console.log('achou');

    } else {
      // console.log('nao achou');

      // ADICIONA NA LISTA
      adicionarObjeto(codcliente, codproduto, quantidade, stotal)

      // SOMA O SUBTOTAL E ARMAZENA O TOTAL GERAL DA VENDA NA VARIAVEL TOTAL
      total = total + parseFloat(stotal)

      res.json({ mensagem: 'PRODUTO NAO ADICIONADO', encontrou: 1 })
    }
  } catch (error) {
    console.log(error)
  }
}

const inserirvendacarrinho = async (req, res) =>{
  try {

  } catch (error){
    console.log(error)
  }
}

module.exports = {
  showVendaView,
  verificaEstoque,
  estoqueAtual,
  addCarrinho,
  inserirvendacarrinho
}
