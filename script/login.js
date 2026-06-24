import { showToast } from "./utils.js";

function validarUsuario(nome, senha) {
    if (nome === admin.nome && senha == admin.senha) {
        return true;
    }
    return false;
}

const admin = {
    nome: 'admin',
    senha: '0000'
};

const inputNome = document.querySelector('#nome-usuario');
const inputSenha = document.querySelector('#senha-usuario');

document.querySelector("#botao-confirmar-login").addEventListener('click', () => {
    if (validarUsuario(inputNome.value.trim(), inputSenha.value)) {
        const manterLogado = document.querySelector('#manter-logado').checked;
        
        if (manterLogado) {
            localStorage.setItem('autenticado', 'true');
        } else {
            sessionStorage.setItem('autenticado', 'true');
        }
        
        window.location.href = './PaginaRegistros.html';
    } else {
        showToast('Login inválido!', 'error');
    }
});