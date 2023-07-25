const pool = require('../db/db')
const PDFDocument = require('pdfkit')
const { exec } = require('shelljs')

// Criação do array vazio para armazenar os objetos
let listaDeObjetos = []

// VARIAVEL QUE ARMAZENA O TOTAL GERAL
let total = 0.0

const showVendaView = async (req, res) => {
  try {
    const rowsCli = await pool.query('SELECT * FROM cliente ORDER BY nome')
    const rowsPro = await pool.query('SELECT * FROM produto ORDER BY nome')
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

const testeLista = async (req, res) => {
  res.render('./venda/teste')
}

const addCarrinho = async (req, res) => {
  try {
    // recebe os parametros da URL
    const codproduto = req.query.codpro
    const quantidade = req.query.qtd
    const stotal = req.query.subtotal

    // Função para adicionar um novo objeto ao array
    function adicionarObjeto (codpro, qtd, subtotal, nome) {
      const novoObjeto = {
        codpro,
        qtd,
        subtotal,
        nome
      }

      listaDeObjetos.push(novoObjeto)
    }

    adicionarObjeto(codproduto, quantidade, stotal)

    // SOMA O SUBTOTAL E ARMAZENA O TOTAL GERAL DA VENDA NA VARIAVEL TOTAL
    total = total + parseFloat(stotal)

    res.json({ mensagem: 'PRODUTO NAO ADICIONADO', encontrou: 1 })
  } catch (error) {
    console.log(error)
  }
}

const inserirvendacarrinho = async (req, res) => {
  try {
    const { codcli } = req.body
    const cols = [codcli, total]

    pool.query('INSERT INTO venda (cliente_codcli,total) VALUES ($1,$2) RETURNING codvenda', cols, (error, response) => {
      const codvenda = response.rows[0].codvenda

      for (let i = 0; i < listaDeObjetos.length; i++) {
        const colsItens = [codvenda, listaDeObjetos[i].codpro, listaDeObjetos[i].subtotal, listaDeObjetos[i].qtd]
        pool.query('INSERT INTO itens_venda (venda_codvenda,produto_codpro,subtotal,qtd) ' +
        ' VALUES ($1,$2,$3,$4)', colsItens, (error, results) => {
          if (error) {
            console.log(error)
          }
        })
      }
      listaDeObjetos = []
      total = 0
      res.redirect('/venda/historicoVendas')
    })
  } catch (error) {
    console.log(error)
  }
}

const removeDoCarrinho = async (req, res) => {
  const index = req.query.index
  const sub = req.query.sub

  // Remove o objeto do array pelo índice fornecido
  listaDeObjetos.splice(index, 1)

  // Atualiza o Total da venda
  total -= sub

  res.json({ mensagem: 'REMOVIDO COM SUCESSO' })
}

const historicoVendas = async (req, res) => {
  const { rows } = await pool.query("SELECT *,TO_CHAR(data_venda,'DD/MM/YYYY') as datav,cliente.nome as nome_cliente " +
  ' FROM venda inner join cliente on ' +
  ' venda.cliente_codcli = cliente.codcli ' +
  ' order by codvenda desc')

  res.render('./venda/index', { resultado: rows })
}

// CHAMA PAGINA DETALHES VENDA E MOSTRA OS PRODUTOS APENAS DA VENDA SELECIONADA
const detalhesVenda = async (req, res) => {
  try {
    const codigo_venda = req.params.codigo
    const resultados = await pool.query('SELECT *,itens_venda.qtd as quantidade,cliente.nome as nome_cliente, ' +
     ' produto.nome as nome_produto FROM itens_venda inner join produto on produto.codpro = itens_venda.produto_codpro' +
     ' inner join venda on venda.codvenda = itens_venda.venda_codvenda ' +
     ' inner join cliente on cliente.codcli = venda.cliente_codcli where codvenda=' + codigo_venda + ' group by (venda.codvenda,produto.codpro,itens_venda.venda_codvenda,itens_venda.produto_codpro,itens_venda.subtotal,itens_venda.qtd,cliente.codcli)  order by venda.codvenda desc ')

    res.render('./reports/detalhesVenda', { varTitle: 'Sistema de Vendas - Venda', resultado: resultados.rows })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro no servidor')
  }
}

// CHAMA PAGINA DETALHES VENDA DE TODAS AS VENDAS
const detalhesTodasVendas = async (req, res) => {
  try {
    const resultados = await pool.query('SELECT *,itens_venda.qtd as quantidade,cliente.nome as nome_cliente, ' +
     ' produto.nome as nome_produto FROM itens_venda inner join produto on produto.codpro = itens_venda.produto_codpro' +
     ' inner join venda on venda.codvenda = itens_venda.venda_codvenda ' +
     ' inner join cliente on cliente.codcli = venda.cliente_codcli group by (venda.codvenda,produto.codpro,itens_venda.venda_codvenda,itens_venda.produto_codpro,itens_venda.subtotal,itens_venda.qtd,cliente.codcli) order by venda.codvenda desc')

    res.render('./reports/detalhesTodasVendas', { varTitle: 'Sistema de Vendas - Venda', resultado: resultados.rows })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro no servidor')
  }
}

const formProdutosMaisVendidosPeriodo = async (req, res) => {
  res.render('./reports/formProdutosMaisVendidosPeriodo')
}

const formVendasPeriodo = async (req, res) => {
  res.render('./reports/formVendasPeriodo')
}

const formMaioresVendasPeriodo = async (req, res) => {
  res.render('./reports/formMaioresVendasPeriodo')
}

const relProdutosMaisVendidosPeriodo = async (req, res) => {
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  const formattedDateStart = startDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');
  const formattedDateEnd = endDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');

  const cols = [startDate,endDate]
  const opcaoExibirResultado = req.body.opcao

  const sql = `SELECT nome,itens_venda.produto_codpro,SUM(qtd) AS soma_qtd from venda 
   INNER JOIN itens_venda ON venda.codvenda = itens_venda.venda_codvenda 
   INNER JOIN produto ON produto.codpro = itens_venda.produto_codpro
   WHERE venda.data_venda BETWEEN $1 AND $2 
   GROUP BY(itens_venda.produto_codpro,produto.nome) ORDER BY soma_qtd DESC`

  

  if (opcaoExibirResultado === 'pdf') {
    const doc = new PDFDocument()

    // Configura o cabeçalho do arquivo PDF
    res.setHeader('Content-Disposition', 'attachment; filename="produtos.pdf"')
    res.setHeader('Content-Type', 'application/pdf')

    // Consulta os dados do banco de dados
    try {
      const result = await pool.query(sql,cols)
      const resultado = result.rows

      // Gera o conteúdo do arquivo PDF
      doc.fontSize(16).text('Produtos mais vendidos por Periodo', { align: 'center' })
      doc.moveDown()
      doc.fontSize(16).text(`Periodo: ${formattedDateStart} - ${formattedDateEnd}`, {align: 'right'})
      doc.moveDown()

      resultado.forEach((produto) => {
        doc.fontSize(14).text(`Código do Produto: ${produto.produto_codpro}`)
        doc.fontSize(14).text(`Nome: ${produto.nome}`)
        doc.fontSize(12).text(`Total: ${produto.soma_qtd}`)
        doc.moveDown()
      })

      // Gera o arquivo PDF
      doc.pipe(res)
      doc.end()

      // Abre o arquivo PDF ao final do processo
      res.on('finish', () => {
        exec('xdg-open produtos.pdf')
      })
    } catch (error) {
      console.error('Erro ao consultar o banco de dados:', error)
      res.status(500).send('Erro ao gerar o arquivo PDF')
    }
  } else {
    const {rows} = await pool.query(sql,cols)
    res.render('./reports/relProdutosMaisVendidosPeriodo',{resultado: rows,startDate,endDate})
  }

}

const relVendasPeriodo = async (req, res) => {
  const startDate = req.body.startDate
  const endDate = req.body.endDate

  // FORMATA DATA QUE RECEBEU DOS CALENDARIOS ESCOLHIDO PELO USUARIO
  const dateStringStart = startDate
  const parts = dateStringStart.split('-')
  const formattedDateStart = `${parts[2]}/${parts[1]}/${parts[0]}`

  const dateStringEnd = endDate
  const parts2 = dateStringEnd.split('-')
  const formattedDateEnd = `${parts2[2]}/${parts2[1]}/${parts2[0]}`

  const sql = "SELECT *,TO_CHAR(data_venda,'DD/MM/YYYY') as datav,cliente.nome as nome_cliente " +
    ' FROM venda inner join cliente on ' +
    ' venda.cliente_codcli = cliente.codcli ' +
    " where data_venda BETWEEN TO_DATE('" + formattedDateStart + "','DD/MM/YYYY') and TO_DATE('" + formattedDateEnd + "','DD/MM/YYYY')" +
    ' order by codvenda desc'
  pool.query(sql, (error, results) => {
    if (error) {
      throw error
    }

    res.render('./reports/relVendasPeriodo', { varTitle: 'Sistema de Vendas - Resultado da Pesquisa', resultado: results.rows, datainicio: formattedDateStart, datafim: formattedDateEnd })
  })
}

// VERIFICA SE ESCOLHEU OPÇAO EXIBIR EM PDF OU NO NAVEGADOR
const relMaioresVendasPeriodo = async (req, res) => {
  const opcaoExibirResultado = req.body.opcao
  const startDate = req.body.startDate
  const endDate = req.body.endDate

  // FORMATA DATA QUE RECEBEU DOS CALENDARIOS ESCOLHIDO PELO USUARIO
  const dateStringStart = startDate
  const parts = dateStringStart.split('-')
  const formattedDateStart = `${parts[2]}/${parts[1]}/${parts[0]}`

  const dateStringEnd = endDate
  const parts2 = dateStringEnd.split('-')
  const formattedDateEnd = `${parts2[2]}/${parts2[1]}/${parts2[0]}`

  const sql = 'select codvenda,data_hora,cliente.codcli,sum(total) as total_comprou ,cliente.nome as nome_cliente ' +
  ' from venda inner join cliente on cliente.codcli = venda.cliente_codcli ' +
  " where data_venda BETWEEN TO_DATE('" + formattedDateStart + "','DD/MM/YYYY') and TO_DATE('" + formattedDateEnd + "','DD/MM/YYYY') GROUP BY (codvenda,venda.cliente_codcli,cliente.nome,cliente.codcli) order by total_comprou desc"

  if (opcaoExibirResultado === 'pdf') {
    const doc = new PDFDocument()

    // Configura o cabeçalho do arquivo PDF
    res.setHeader('Content-Disposition', 'attachment; filename="clientes.pdf"')
    res.setHeader('Content-Type', 'application/pdf')

    // Consulta os dados do banco de dados
    try {
      const result = await pool.query(sql)
      const resultado = result.rows

      // Gera o conteúdo do arquivo PDF
      doc.fontSize(16).text('Clientes que mais Compraram por Periodo', { align: 'center' })
      doc.moveDown()

      resultado.forEach((cliente) => {
        doc.fontSize(10).text(`Código do cliente: ${cliente.codcli}`)
        doc.fontSize(14).text(`Nome: ${cliente.nome_cliente}`)
        doc.fontSize(12).text(`Total: ${cliente.total_comprou}`)
        doc.fontSize(12).text(`Total: ${cliente.data_hora}`)
        doc.moveDown()
      })

      // Gera o arquivo PDF
      doc.pipe(res)
      doc.end()

      // Abre o arquivo PDF ao final do processo
      res.on('finish', () => {
        exec('xdg-open clientes.pdf')
      })
    } catch (error) {
      console.error('Erro ao consultar o banco de dados:', error)
      res.status(500).send('Erro ao gerar o arquivo PDF')
    }
  } else {
    pool.query(sql, (error, results) => {
      if (error) {
        throw error
      }
      res.render('./reports/relMaioresVendasPeriodo', { varTitle: 'Sistema de Vendas - Resultado da Pesquisa', resultado: results.rows, datainicio: formattedDateStart, datafim: formattedDateEnd })
    })
  }
}

const pesquisaRadioAntigas = async (req, res) => {
  const { rows } = await pool.query("SELECT *,TO_CHAR(data_venda,'DD/MM/YYYY') as datav,cliente.nome as nome_cliente " +
  ' FROM venda inner join cliente on ' +
  ' venda.cliente_codcli = cliente.codcli ' +
  ' order by codvenda')

  res.render('./venda/index', { resultado: rows })
}

const verificaPrecoVenda = async (req, res) => {
  try {
    const codpro = req.query.codpro
    const operacao = req.query.operacao
    const index = req.query.index
   
    const {rows} = await pool.query('SELECT precovenda FROM produto WHERE codpro = $1',[codpro])
    
    // ATUALIZA OS CAMPOS SUBTOTAL,QTD DA LISTA E O TOTAL GERAL
    if (operacao === 'adicionar') {
      total += parseFloat(rows[0].precovenda)
      listaDeObjetos[index].subtotal =parseFloat(listaDeObjetos[index].subtotal ) + parseFloat(rows[0].precovenda)
      listaDeObjetos[index].qtd = parseInt(listaDeObjetos[index].qtd) + 1

   } else {
      total -= parseFloat(rows[0].precovenda)
      listaDeObjetos[index].subtotal =parseFloat(listaDeObjetos[index].subtotal ) -  parseFloat(rows[0].precovenda)
      listaDeObjetos[index].qtd = parseInt(listaDeObjetos[index].qtd) - 1
   }
    res.send(rows[0])
  } catch (error) {
    console.log(error)
  }  
}

module.exports = {
  showVendaView,
  verificaEstoque,
  estoqueAtual,
  addCarrinho,
  inserirvendacarrinho,
  historicoVendas,
  detalhesVenda,
  detalhesTodasVendas,
  formVendasPeriodo,
  relVendasPeriodo,
  formMaioresVendasPeriodo,
  relMaioresVendasPeriodo,
  pesquisaRadioAntigas,
  testeLista,
  removeDoCarrinho,
  verificaPrecoVenda,
  formProdutosMaisVendidosPeriodo,
  relProdutosMaisVendidosPeriodo
}
