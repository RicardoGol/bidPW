function showToast(message, type = 'success', duration = 5000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 20px 28px;
        border-radius: 6px;
        color: white;
        font-size: 19px;
        z-index: 9999;
        background-color: ${type === 'error' ? '#dc3545' : '#28a745'};
        transition: opacity 0.3s ease;
        opacity: 1;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    
    // showToast('Login inválido!', 'error');
    // showToast('Logado com sucesso!', 'success');
};

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