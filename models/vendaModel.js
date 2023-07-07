const { response } = require('express')
const pool = require('../db/db')

// Criação do array vazio para armazenar os objetos
let listaDeObjetos = []

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
    function adicionarObjeto (codpro, qtd, subtotal) {
      const novoObjeto = {
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
      adicionarObjeto(codproduto, quantidade, stotal)

      // SOMA O SUBTOTAL E ARMAZENA O TOTAL GERAL DA VENDA NA VARIAVEL TOTAL
      total = total + parseFloat(stotal)

      res.json({ mensagem: 'PRODUTO NAO ADICIONADO', encontrou: 1 })
    }
  } catch (error) {
    console.log(error)
  }
}

const inserirvendacarrinho = (req, res) => {
  try {
    const { codcli } = req.body
    const cols = [codcli, total]

    pool.query('INSERT INTO venda (cliente_codcli,total) VALUES ($1,$2) RETURNING codvenda', cols, (error, response) => {
      const codvenda = response.rows[0].codvenda

      for (let i = 0; i < listaDeObjetos.length; i++) {
        const cols_itens = [codvenda, listaDeObjetos[i].codpro, listaDeObjetos[i].subtotal, listaDeObjetos[i].qtd]
        pool.query('INSERT INTO itens_venda (venda_codvenda,produto_codpro,subtotal,qtd) ' +
        ' VALUES ($1,$2,$3,$4)', cols_itens, (error, results) => {
          if (error) {
            console.log(error)
          }
        })
      }
      listaDeObjetos = []
      total = 0
    })
    res.redirect('/venda/historicoVendas')
  } catch (error) {
    console.log(error)
  }
}

const historicoVendas = async (req, res) =>{
  const { rows } = await pool.query("SELECT *,TO_CHAR(data_venda,'DD/MM/YYYY') as datav,cliente.nome as nome_cliente "+
  ' FROM venda inner join cliente on '+
  ' venda.cliente_codcli = cliente.codcli '+
  ' order by codvenda desc')
     
  res.render('./venda/index',{resultado : rows});

  
}

//CHAMA PAGINA DETALHES VENDA E MOSTRA OS PRODUTOS APENAS DA VENDA SELECIONADA
const detalhesVenda = async (req, res) => {
  try {
    var codigo_venda = req.params.codigo;
    const resultados = await pool.query('SELECT *,itens_venda.qtd as quantidade,cliente.nome as nome_cliente, '+
     ' produto.nome as nome_produto FROM itens_venda inner join produto on produto.codpro = itens_venda.produto_codpro'+
     ' inner join venda on venda.codvenda = itens_venda.venda_codvenda '+
     ' inner join cliente on cliente.codcli = venda.cliente_codcli where codvenda='+codigo_venda+' group by (venda.codvenda,produto.codpro,itens_venda.venda_codvenda,itens_venda.produto_codpro,itens_venda.subtotal,itens_venda.qtd,cliente.codcli)  order by venda.codvenda desc ');
    
    res.render('./venda/detalhes_venda', { varTitle: "Sistema de Vendas - Venda",resultado: resultados.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
}

module.exports = {
  showVendaView,
  verificaEstoque,
  estoqueAtual,
  addCarrinho,
  inserirvendacarrinho,
  historicoVendas,
  detalhesVenda
}
