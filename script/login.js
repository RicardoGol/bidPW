import { showToast } from "./utils.js";

const inputNome = document.querySelector('#nome-usuario');
const inputSenha = document.querySelector('#senha-usuario');

document.querySelector("#botao-confirmar-login").addEventListener('click', async () => {
    const resposta = await fetch('php/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: inputNome.value.trim(),
            senha: inputSenha.value.trim()                      // lacuna 1: o valor do input da senha
        })
    });
    const resultado = await resposta.json();            // lacuna 2: abrir a bandeja

    if (resultado.erro) {
        showToast(resultado.erro, 'error');
        return;
    }

    body: JSON.stringify({
    usuario: inputNome.value.trim(),
    senha: inputSenha.value.trim(),
    manter: document.querySelector('#manter-logado').checked
})
    window.location.href = './PaginaRegistros.html';
});