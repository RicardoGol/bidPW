function validarUsuario(nome, senha){
    if(nome === admin.nome && senha == admin.senha){
        return(true);
    }
    else{
        return(false);
    }
}
const admin = {
    nome: 'admin',
    senha: '0000'
};


document.querySelector("#botao-confirmar-login").addEventListener('click', () => {
    if(validarUsuario(inputNome.value, inputSenha.value)){
         window.location.href = './PaginaRegistros.html';
    }
    else{
        showToast('Login inválido!', 'error')
    }
});

const inputNome = document.querySelector('#nome-usuario');
const inputSenha = document.querySelector('#senha-usuario');