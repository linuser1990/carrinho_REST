const pool = require('../db/db');


// Listar todos os clientes
const getAllClientes = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cliente');

    //renderiza a view clientes e passa a variavel pessoas contendo o resultado da query sql
    res.render('./cliente/index',{pessoas: rows});
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar os clientes' });
  }
};

// Obter um cliente por ID
const getClienteById = async (req, res) => {
  const { codcli } = req.params;
   
  try {
    const { rows } = await pool.query('SELECT * FROM cliente WHERE codcli = $1', [codcli]);

    if (rows.length > 0) {
      res.render('./cliente/edit',{pessoas: rows})
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter o cliente' });
  }
};

// Criar um novo cliente
const createCliente = async (req, res) => {
  const { nome,endereco,cpf,cel } = req.body;

  try {
    const { rows } = await pool.query('INSERT INTO cliente (nome,endereco,cpf,cel) VALUES ($1,$2,$3,$4) RETURNING *', [nome,endereco,cpf,cel]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o cliente' });
  }
};



// Atualizar um cliente
const updateCliente = async (req, res) => {
 const { codcli } = req.params;
 const { nome, endereco,cpf,cel } = req.body;
  
  try {
    const { rows } = await pool.query('UPDATE cliente SET nome = $1, endereco= $2, '+
    'cpf = $3, cel = $4 WHERE codcli = $5 RETURNING *', [nome,endereco,cpf,cel,codcli]);

    if (rows.length > 0) {
      res.redirect('/clientes');
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o cliente',error });
  }
};

// Excluir um cliente
const deleteCliente = async (req, res) => {
  const { codcli } = req.params;

  try {
    const { rows } = await pool.query('DELETE FROM cliente WHERE codcli = $1 RETURNING *', [codcli]);

    if (rows.length > 0) {
      res.json({ message: 'Cliente excluído com sucesso' });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o cliente' });
  }
};


module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  
};
