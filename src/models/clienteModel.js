const pool = require('../db/db')
const PDFDocument = require('pdfkit')
const { exec } = require('shelljs')
const bcrypt = require('bcrypt');
// const open = require('open');
// const ordem = "nome";

// Listar todos os clientes
const getAllClientes = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cliente order by nome')

    // renderiza a view clientes e passa a variavel pessoas contendo o resultado da query sql
    res.render('./cliente/index', { pessoas: rows })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar os clientes' })
  }
}

// Obter um cliente por ID
const getClienteById = async (req, res) => {
  const { codcli } = req.params

  try {
    const { rows } = await pool.query('SELECT * FROM cliente WHERE codcli = $1', [codcli])

    if (rows.length > 0) {
      res.render('./cliente/edit', { pessoas: rows })
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter o cliente', error })
  }
}

// Criar um novo cliente
const createCliente = async (req, res) => {
  const { nome, endereco, cpf, cel, email, senha } = req.body
 
  const hashedPassword = await bcrypt.hash(senha, 10); // Gera o hash da senha

  try {
    const { rows } = await pool.query('INSERT INTO cliente (nome,endereco,cpf,cel,email,senha) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [nome, endereco, cpf, cel, email, hashedPassword ])
    res.redirect('/clientes')
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o cliente' })
  }
}

// Atualizar um cliente
const updateCliente = async (req, res) => {
  
  const { codcli } = req.params
  const { nome, endereco, cpf, cel, email} = req.body

  
  try {
    const { rows } = await pool.query('UPDATE cliente SET nome = $1, endereco= $2, ' +
    'cpf = $3, cel = $4 , emial = $5 WHERE codcli = $6 RETURNING *', [nome, endereco, cpf, cel,email, codcli])

    if (rows.length > 0) {
      res.status(200).json({ message: 'Cliente atualizado com sucesso' })
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o cliente' })
  }
}

// Excluir um cliente
const deleteCliente = async (req, res) => {
  const { codcli } = req.params

  try {
    const { rows } = await pool.query('DELETE FROM cliente WHERE codcli = $1 RETURNING *', [codcli])

    if (rows.length > 0) {
      res.json({ message: 'Cliente excluído com sucesso' })
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o cliente' })
  }
}

const showCreateView = async (req, res) => {
  try {
    res.render('./cliente/create')
  } catch (error) {
    res.status(500).json({ error: 'Erro 000', error })
  }
}

// VERIFICA SE ESCOLHEU OPÇAO EXIBIR EM PDF OU NO NAVEGADOR
const relClienteMaisComprouPeriodo = async (req, res) => {
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

  const sql = 'select cliente.codcli,sum(total) as total_comprou ,cliente.nome as nome_cliente ' +
  ' from venda inner join cliente on cliente.codcli = venda.cliente_codcli ' +
  " where data_venda BETWEEN TO_DATE('" + formattedDateStart + "','DD/MM/YYYY') and TO_DATE('" + formattedDateEnd + "','DD/MM/YYYY') GROUP BY (cliente.nome,cliente.codcli) order by total_comprou desc"

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
        doc.fontSize(14).text(`Código do cliente: ${cliente.codcli}`)
        doc.fontSize(14).text(`Nome: ${cliente.nome_cliente}`)
        doc.fontSize(12).text(`Total: ${cliente.total_comprou}`)
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
      res.render('./reports/relClienteMaisComprouPeriodo', { varTitle: 'Sistema de Vendas - Resultado da Pesquisa', resultado: results.rows, datainicio: formattedDateStart, datafim: formattedDateEnd })
    })
  }
}

const formClienteMaisComprou = async (req, res) => {
  res.render('./reports/formClienteMaisComprou')
}


const showFormClienteMaisComprouPeriodoPDF = async (rea, res) => {
  res.render('./reports/formClienteMaisComprouPeriodoPDF')
}

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  showCreateView,
  formClienteMaisComprou,
  relClienteMaisComprouPeriodo,
  showFormClienteMaisComprouPeriodoPDF
}
