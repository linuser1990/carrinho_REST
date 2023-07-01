var totalgeral = 0.0;

function cancelar() {

    window.location.href = "/clientes";
}

function cancelarProdutos() {

    window.location.href = "/produtos";
}

function busca()
{
    window.location.href = "/produtos";
}

//essa função armazena os codigos do produto e do cliente 
// e preenche o value do input 
//o preço venda tambem é passado ao selecionar o produto
function getSelectedValue() {
  const selectCliente = document.getElementById("selectcliente");
  const selectProduto = document.getElementById("selectproduto");

  var precovenda = document.getElementById("precovenda");

  const codcli = document.getElementById("codcli");
  const codpro = document.getElementById("codpro");

  const selectedValueCliente = selectCliente.value;
  const selectedValueProduto = selectProduto.value;

  codcli.value = selectCliente.value;
  
 
//PEGA OS VALORES SEPARADOS POR VIGULA
  var selectElement = document.getElementById('selectproduto');
  var selectedOption = selectElement.options[selectElement.selectedIndex];

  //essa variavel armazena os dois campos passados ao selecionar o select, separados por virgula
  var values = selectedOption.value.split(',');

  codpro.value = values[0];

  /*console.log(values[0]); // valor1
  console.log(values[1]); // valor2  
  console.log(selectProduto.value); */

  //values[1] é o segundo valor passado  depois da virgula,ao selecionar o select
  precovenda.value=values[1];
}


//FORMATA CELULAR
function formatarTelefone(telefone) {
    // Remove tudo que não for dígito do número de telefone
    let numeros = telefone.replace(/\D/g, '');
    
    // Adiciona os parênteses e o traço no número formatado
    numeros = numeros.replace(/^(\d{2})(\d)/g, '($1)$2');
    numeros = numeros.replace(/(\d{5})(\d)/, '$1-$2');
    
    // Retorna o número formatado
    return numeros;
  }


  //FUNÇÃO QUE VERIFICA O ESTOQUE ATUAL NO BANCO E RETORNA A QUANTIDADE, 
  //E MOSTRA NA TELA ATUAL,ALTERANDO O TEXTO DA TAG <h6>CASO SEJA <= 10 A COR DO TEXO É VERMELHA
  function estoqueAtual()
  {
    var codpro = document.getElementById('codpro').value;

    var alertaEstDisp = document.getElementById('alertaEstDisp');

     $.ajax({
      url: '/estoqueAtual',
      type: 'GET',
      data: {  
        codpro: codpro
      },
      success: function(response) {
        alertaEstDisp.style.display = "block";
        alertaEstDisp.style.color = response.corTexto;
        alertaEstDisp.innerText = ("Estoque atual: "+response.estoque);
      },
      error: function(error) {
        console.error('error.'); // Optional: Display an error message
      }
  })
  
}
  

  //atualiza o campo total automatico, multiplicando qtd por precovenda
  function subtotalVenda()
  {
       
    var qtd = document.getElementById('qtd');
    var precovenda = document.getElementById('precovenda');
    var subtotal = document.getElementById('subtotal');
    subtotal.value = (parseFloat(qtd.value)*parseFloat(precovenda.value));

  }

  //CHAMA A ROTA '/addCarrinho' de forma assincrona, sem ficar carregando a pagina
  //utiliza AJAX  e a biblioteca jquery para fazer isso
  function redirecionarParaCarrinho2() {
    var codpro = document.getElementById('codpro').value; // Obter o valor do campo de entrada 'codpro'
    var codcli = document.getElementById('codcli').value; // Obter o valor do campo de entrada 'codcli'
    var qtd = document.getElementById('qtd').value; // Obter o valor do campo de entrada 'qtd'
    var subtotal = document.getElementById('subtotal').value; // Obter o valor do campo de entrada 'qtd'
    var campototal = document.getElementById('total');

    var alertaRepetido = document.getElementById('alertaRepetido');
    


    //DESABILITA O SELECT CLIENTE AO INICIAR UMA VENDA PARA NAO MUDAR O CLIENTE NO MEIO DA VENDA
    var selectCliente = document.getElementById("selectcliente");
    selectCliente.disabled = true;

    $.ajax({
      url: '/addCarrinho',
      type: 'GET',
      data: {
        codcli: codcli,
        codpro: codpro,
        qtd: qtd,
        subtotal: subtotal
      },
      success: function(response) {

        //POSSO RETORNAR ALGUMA VARIAVEL DA ROTA '/addCarrinho' Nesse caso foi a variavel 'mensagem'
        console.log(response.mensagem); // Optional: Display a success message
        
        
        //SE NÃO ACHOU 
        if(response.encontrou ==1)
        {
          //soma o subtotal a cada produto adicionado ao carrinho
          totalgeral = totalgeral+parseFloat(subtotal);
    

          //preenche o campo total com a soma dos subtotal
          //A VARIAVEL totalgeral É ZERADA TODA VEZ QUE INICIA UMA NOVA VENDA
          //PORQUE ELA PEGA O VALOR 0 PREENCHIDO POR PADRAO NO CAMPO TOTAL
          campototal.value = parseFloat(totalgeral);
            
        }else
        {

          //EXIBE A MENSAGEM QUE JA FOI ADICIONADO O MESMO PRODUTO E ESCONDE A MENSAGEM APOS ALGUNS SEGUNDOS
          alertaRepetido.style.display = "block";
          setTimeout(function() {
            alertaRepetido.style.display = "none";
          }, 2000);
          
            
         
        }
      },
      error: function(error) {
        console.error('An error occurred while adding to the cart.'); // Optional: Display an error message
      }
    });

       
  }


  //---------- CODIGO ANTIGO, A APAGINA FICAVA CARREGANDO ----------------
  //CAPTURA OS VALUES DA PAGINA E COLOCA EM UMA URL PASSANDO PARA A ROTA /addCarrinho
  function redirecionarParaCarrinho() {
    var codpro = document.getElementById('codpro').value; // Obter o valor do campo de entrada 'codpro'
    var codcli = document.getElementById('codcli').value; // Obter o valor do campo de entrada 'codcli'
    var qtd = document.getElementById('qtd').value; // Obter o valor do campo de entrada 'qtd'
    var subtotal = document.getElementById('subtotal').value; // Obter o valor do campo de entrada 'qtd'
    var campototal = document.getElementById('total');



    //soma o subtotal a cada produto adicionado ao carrinho
    totalgeral = totalgeral+parseFloat(subtotal);

    //preenche o campo total com a soma dos subtotal
    //A VARIAVEL totalgeral É ZERADA TODA VEZ QUE INICIA UMA NOVA VENDA
    //PORQUE ELA PEGA O VALOR 0 PREENCHIDO POR PADRAO NO CAMPO TOTAL
    campototal.value =parseFloat(totalgeral);


    //DESABILITA O SELECT CLIENTE AO INICIAR UMA VENDA PARA NAO MUDAR O CLIENTE NO MEIO DA VENDA
    var selectCliente = document.getElementById("selectcliente");
    selectCliente.disabled = true;

    // Construir a URL com base nos valores dos campos de entrada
    var url = '/addCarrinho?codpro=' + encodeURIComponent(codpro) + '&codcli=' + encodeURIComponent(codcli) + '&qtd=' + encodeURIComponent(qtd) + '&subtotal=' + encodeURIComponent(subtotal);
  
    // Redirecionar para a URL
    window.location.href = url;
    
  }

  function mostrarTexto() {
    var elemento = document.getElementById("textoOculto");
    elemento.style.display = "block";
    setTimeout(function(){
      elemento.style.display = "none";
    }, 3000);
  }

  //ZERA A VARIAVEL TOTALGERAL
  function limparCampo()
  {
    totalgeral=0;
  }




