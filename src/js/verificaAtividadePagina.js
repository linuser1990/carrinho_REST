/* ESSE SCRIPT VERIFICA A ATIVIDADE NA PAGINA
        SE NÃO MECHER O MOUSE OU NAO DIGITAR OU
        NAO ROLAR A PAGINA NO CASO DE CELULAR,
        É REDIRECIONADO PARA TELA DE LOGIN NOVAMENTE */

let inactivityTimeout

// Função para reiniciar o temporizador de inatividade
function resetInactivityTimer () {
  clearTimeout(inactivityTimeout)
  inactivityTimeout = setTimeout(function () {
    // Exibir um alerta quando o tempo de inatividade expirar
    alert('A sessão expirou. Clique em OK para fazer logout.')
    // Após clicar em OK, chamar a função logout
    logout()
  }, 5000) //  minutos de inatividade
}

// Função para fazer logout
function logout () {
  window.location.href = '/login/logout'
}

// Monitorar eventos de movimentação do cursor
document.addEventListener('mousemove', resetInactivityTimer)

// Monitorar eventos de digitação
document.addEventListener('keydown', resetInactivityTimer)

document.addEventListener('touchstart', resetInactivityTimer)
document.addEventListener('touchmove', resetInactivityTimer)

// Iniciar o temporizador de inatividade ao carregar a página
resetInactivityTimer()
