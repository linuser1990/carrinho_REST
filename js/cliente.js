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