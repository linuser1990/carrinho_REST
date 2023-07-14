let totalgeral = 0.0

const listaDeObjetos = []

let encontrou = 1 // não achou

function cancelar () {
  window.location.href = '/clientes'
}

function cancelarProdutos () {
  window.location.href = '/produtos'
}

function busca () {
  window.location.href = '/produtos'
}

// essa função armazena os codigos do produto e do cliente
// e preenche o value do input
// o preço venda tambem é passado ao selecionar o produto
function getSelectedValue () {
  const selectCliente = document.getElementById('selectcliente')
  const selectProduto = document.getElementById('selectproduto')

  const precovenda = document.getElementById('precovenda')

  const codcli = document.getElementById('codcli')
  const codpro = document.getElementById('codpro')

  const selectedValueCliente = selectCliente.value
  const selectedValueProduto = selectProduto.value

  codcli.value = selectCliente.value

  // PEGA OS VALORES SEPARADOS POR VIGULA
  const selectElement = document.getElementById('selectproduto')
  const selectedOption = selectElement.options[selectElement.selectedIndex]

  // essa variavel armazena os dois campos passados ao selecionar o select, separados por virgula
  const values = selectedOption.value.split(',')

  codpro.value = values[0]

  /* console.log(values[0]); // valor1
  console.log(values[1]); // valor2
  console.log(selectProduto.value); */

  // values[1] é o segundo valor passado  depois da virgula,ao selecionar o select
  precovenda.value = values[1]
}

// FORMATA CELULAR
function formatarTelefone (telefone) {
  // Remove tudo que não for dígito do número de telefone
  let numeros = telefone.replace(/\D/g, '')

  // Adiciona os parênteses e o traço no número formatado
  numeros = numeros.replace(/^(\d{2})(\d)/g, '($1)$2')
  numeros = numeros.replace(/(\d{5})(\d)/, '$1-$2')

  // Retorna o número formatado
  return numeros
}

// FUNÇÃO QUE VERIFICA O ESTOQUE ATUAL NO BANCO E RETORNA A QUANTIDADE,
// E MOSTRA NA TELA ATUAL,ALTERANDO O TEXTO DA TAG <h6>CASO SEJA <= 10 A COR DO TEXO É VERMELHA
function estoqueAtual () {
  const codpro = document.getElementById('codpro').value

  const alertaEstDisp = document.getElementById('alertaEstDisp')

  $.ajax({
    url: '/venda/estoqueAtual',
    type: 'GET',
    data: {
      codpro
    },
    success: function (response) {
      if (response.estoque <= 10) {
        alertaEstDisp.style.color = 'red'
      } else {
        alertaEstDisp.style.color = 'green'
      }
      alertaEstDisp.style.display = 'block'
      alertaEstDisp.innerText = ('Estoque atual: ' + response.estoque)
    },
    error: function (error) {
      console.error('error.') // Optional: Display an error message
    }
  })
}

// atualiza o campo total automatico, multiplicando qtd por precovenda
function subtotalVenda () {
  const qtd = document.getElementById('qtd')
  const precovenda = document.getElementById('precovenda')
  const subtotal = document.getElementById('subtotal')
  subtotal.value = (parseFloat(qtd.value) * parseFloat(precovenda.value))
}

// CHAMA A ROTA '/addCarrinho' de forma assincrona, sem ficar carregando a pagina
// utiliza AJAX  e a biblioteca jquery para fazer isso
function redirecionarParaCarrinho2 () {
  const codpro = document.getElementById('codpro').value // Obter o valor do campo de entrada 'codpro'
  const codcli = document.getElementById('codcli').value // Obter o valor do campo de entrada 'codcli'
  const qtd = document.getElementById('qtd').value // Obter o valor do campo de entrada 'qtd'
  const subtotal = document.getElementById('subtotal').value // Obter o valor do campo de entrada 'qtd'
  const campototal = document.getElementById('total')
  const adicionarBtn = document.getElementById('adicionar')
  const alertaRepetido = document.getElementById('alertaRepetido')
  const alertaCliente = document.getElementById('alertaCliente')

  const selectProduto = document.getElementById('selectproduto')
  const selectedIndex = selectProduto.selectedIndex
  const selectedOptionText = selectProduto.options[selectedIndex].text

  // DESABILITA O SELECT CLIENTE AO INICIAR UMA VENDA PARA NAO MUDAR O CLIENTE NO MEIO DA VENDA
  const selectCliente = document.getElementById('selectcliente')

  // VERIFICA SE CLIENTE OU PODUTO NÃO FORAÕ SELECIONADOS
  if (selectCliente.value === 'Selecione um cliente' || selectProduto.value === 'Selecione um produto') {
    alertaCliente.innerHTML = 'Cliente ou Produto não selecionado!'
    alertaCliente.style.color = 'red'
    alertaCliente.style.display = 'block'
    setTimeout(function () {
      alertaCliente.style.display = 'none'
    }, 3000)
  } else {
    selectCliente.disabled = true

    // VERIFICA SE JA TEM O MESMO PRODUTO ADICIONADO
    for (let i = 0; i < listaDeObjetos.length; i++) {
      if (listaDeObjetos[i].nome === selectedOptionText) {
        console.log('achou')
        encontrou = 2
        break
      } else {
        encontrou = 1
      }
    }

    // SE NÃO ACHOU
    if (encontrou === 1) {
    // soma o subtotal a cada produto adicionado ao carrinho
      totalgeral = totalgeral + parseFloat(subtotal)

      // preenche o campo total com a soma dos subtotal
      // A VARIAVEL totalgeral É ZERADA TODA VEZ QUE INICIA UMA NOVA VENDA
      // PORQUE ELA PEGA O VALOR 0 PREENCHIDO POR PADRAO NO CAMPO TOTAL
      campototal.value = parseFloat(totalgeral)

      // ALTERA O BOTAO ADICIONAR E VOLTA AO ESTADO INICIAL APÓS O TEMPO DETERMINADO
      adicionarBtn.classList.remove('btn-light')
      adicionarBtn.classList.add('btn-success')
      adicionarBtn.textContent = 'ADICIONADO COM SUCESSO'
      setTimeout(function () {
        adicionarBtn.classList.remove('btn-success')
        adicionarBtn.classList.add('btn-secondary')
        adicionarBtn.textContent = 'Adicionar ao carrinho'
      }, 600)

      adicionarObjeto(codpro, qtd, subtotal, selectedOptionText)

      // LISTA DE ITENS ADICIONADOS, QUE APARECE NA TELA PRINCIPAL
      function adicionarObjeto (codpro, qtd, subtotal, nome) {
        const novoObjeto = {
          codpro,
          qtd,
          subtotal,
          nome
        }

        listaDeObjetos.push(novoObjeto)

        $.ajax({
          url: '/venda/addCarrinho',
          type: 'GET',
          data: {
            codcli,
            codpro,
            qtd,
            subtotal
          },
          success: function (response) {
          },
          error: function (error) {
            console.error('An error occurred while adding to the cart.') // Optional: Display an error message
          }
        })

        // Atualiza a lista exibida na página
        atualizarLista()
      }
    } else {
    // EXIBE A MENSAGEM QUE JA FOI ADICIONADO O MESMO PRODUTO E ESCONDE A MENSAGEM APOS ALGUNS SEGUNDOS
      alertaRepetido.style.display = 'block'
      alertaRepetido.innerHTML = 'Produto já adicionado na lista'
      setTimeout(function () {
        alertaRepetido.style.display = 'none'
      }, 2000)
    }
  }
}

function removerObjeto (index, event) {
  event.preventDefault()

  const campototal = document.getElementById('total')
  const sub = listaDeObjetos[index].subtotal

  // descrementa total geral
  totalgeral -= sub

  campototal.value = parseFloat(totalgeral)

  // Remove o objeto do array pelo índice fornecido
  listaDeObjetos.splice(index, 1)

  // REMOVE TAMBEM NA ROTA
  $.ajax({
    url: '/venda/removeDoCarrinho',
    type: 'GET',
    data: {
      index,
      sub
    },
    success: function (response) {
    },
    error: function (error) {
      console.error('An error occurred while adding to the cart.') // Optional: Display an error message
    }
  })

  // Atualiza a lista exibida na página
  atualizarLista()
}

function atualizarLista () {
  const tabela = document.getElementById('tabelaProdutos')
  tabela.innerHTML = ''

  const cabecalho = tabela.createTHead()
  var row = cabecalho.insertRow()
  const colCodigo = document.createElement('th')
  colCodigo.innerHTML = 'Código'
  row.appendChild(colCodigo)

  const colNome = document.createElement('th')
  colNome.style.width = '300px'
  colNome.innerHTML = 'Nome'
  row.appendChild(colNome)

  const colQuantidade = document.createElement('th')
  colQuantidade.innerHTML = 'Quantidade'
  row.appendChild(colQuantidade)

  const colSubtotal = document.createElement('th')
  colSubtotal.innerHTML = 'Subtotal'
  row.appendChild(colSubtotal)

  const colAcao = document.createElement('th')
  colAcao.innerHTML = ''
  row.appendChild(colAcao)

  const corpoTabela = tabela.createTBody()
  for (let i = 0; i < listaDeObjetos.length; i++) {
    const produto = listaDeObjetos[i]
    var row = corpoTabela.insertRow()

    const codigoCell = row.insertCell()
    codigoCell.innerHTML = produto.codpro

    const nomeCell = row.insertCell()
    nomeCell.innerHTML = produto.nome

    const quantidadeCell = row.insertCell()
    quantidadeCell.innerHTML = produto.qtd

    const subtotalCell = row.insertCell()
    subtotalCell.innerHTML = produto.subtotal

    const acaoCell = row.insertCell()
    const button = document.createElement('button')
    button.appendChild(document.createTextNode('Excluir'))
    button.setAttribute('onclick', 'removerObjeto(' + i + ', event)')
    acaoCell.appendChild(button)

    const buttonMinus = document.createElement('button');
    buttonMinus.appendChild(document.createTextNode('-'));
    buttonMinus.setAttribute('onclick', `mudarQuantidade(${i}, 'subtrair', event)`);
    buttonMinus.setAttribute('id', 'subtrair'); // Atribuindo o ID 'meuId' ao botão
    acaoCell.appendChild(buttonMinus);

    const buttonPlus = document.createElement('button');
    buttonPlus.appendChild(document.createTextNode('+'));
    buttonPlus.setAttribute('onclick', `mudarQuantidade(${i}, 'adicionar', event)`);
    buttonPlus.setAttribute('id', 'adicionar'); // Atribuindo o ID 'meuId' ao botão
    acaoCell.appendChild(buttonPlus);
  }
}

function mudarQuantidade(index, operacao, event) {
  event.preventDefault()
  const produto = listaDeObjetos[index];
  const buttonSubtrair = document.getElementById('subtrair')
  const buttonAdicionar = document.getElementById('adicionar')
  var campototal = document.getElementById('total')
  var codpro = produto.codpro
  var precoRecebido

  if (operacao === 'adicionar') {
    produto.qtd++

    $.ajax({
      url: '/venda/verificaPrecoVenda',
      type: 'GET',
      data: {
        codpro,operacao,index
      },
      success: function (response) {
        produto.subtotal = parseFloat(produto.subtotal) + parseFloat(response.precovenda)
        campototal.value = parseFloat(campototal.value) + parseFloat(response.precovenda)
        totalgeral = totalgeral + parseFloat(produto.subtotal)
        atualizarLista();
        
      },
      error: function (error) {
        console.error('error.') // Optional: Display an error message
      }
    })

  } else if (operacao === 'subtrair' && produto.qtd >1) {
    produto.qtd--
    $.ajax({
      url: '/venda/verificaPrecoVenda',
      type: 'GET',
      data: {
        codpro,operacao,index
        
      },
      success: function (response) {
        produto.subtotal = parseFloat(produto.subtotal) - parseFloat(response.precovenda)
        campototal.value = parseFloat(campototal.value) - parseFloat(response.precovenda)
        totalgeral = totalgeral - parseFloat(response.precovenda)
        atualizarLista();
        
      },
      error: function (error) {
        console.error('error.',error) // Optional: Display an error message
      }
    })
   
  }

  // Atualizar a tabela após a alteração da quantidade
  
}

function mostrarTexto () {
  const elemento = document.getElementById('textoOculto')
  elemento.style.display = 'block'
  setTimeout(function () {
    elemento.style.display = 'none'
  }, 3000)
}

// ZERA A VARIAVEL TOTALGERAL
function limparCampo () {
  totalgeral = 0
  encontrou = 1
}
