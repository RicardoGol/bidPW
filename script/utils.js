export function showToast(message, type = 'success', duration = 5000) {
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

export function saveToLocalStorage(key, data) {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
}

export function loadFromLocalStorage(key) {
    const json = localStorage.getItem(key);
    if (json === null) {
        return [];
    }
    return JSON.parse(json);
}

export function renderizarJogadores(clubeId, container, podeRescindir = false) {
    const jogadores = loadFromLocalStorage('jogadores');
    const filtrados = jogadores.filter(j => j.clube.id === parseInt(clubeId) && j.ativo);

    container.innerHTML = '';

    if (filtrados.length === 0) {
        container.innerHTML = '<p class="sem-jogadores">Nenhum jogador registrado neste clube.</p>';
        return;
    }

    filtrados.forEach(jogador => {
        const card = document.createElement('div');
        card.classList.add('card-jogador');

        const botaoRescindir = (podeRescindir && jogador.contrato.tipo !== 'rescisao') ? `
            <button class="botao-rescindir" data-id="${jogador.id}">Rescindir</button>
        ` : '';

        card.innerHTML = `
            <div class="card-header">
                <span class="card-nome">${jogador.nome}</span>
                <span class="card-apelido">${jogador.apelido || ''}</span>
            </div>
            <div class="card-info">
                <span><strong>Clube:</strong> ${jogador.clube.name}</span>
                <span><strong>Série:</strong> ${jogador.clube.division}</span>
                <span><strong>Contrato:</strong> ${jogador.contrato.tipo}</span>
                <span><strong>Início:</strong> ${jogador.contrato.inicio}</span>
                <span><strong>Inscrição:</strong> ${jogador.contrato.inscricao}</span>
                <span><strong>Nascimento:</strong> ${jogador.nascimento}</span>
            </div>
            ${botaoRescindir}
        `;

        // Adiciona o evento no botão de rescindir
        const btn = card.querySelector('.botao-rescindir');
        if (btn) {
            btn.addEventListener('click', () => {
                const todos = loadFromLocalStorage('jogadores');
                const idx = todos.findIndex(j => j.id === jogador.id);
                if (idx !== -1) {
                    todos[idx].contrato.tipo = 'rescisao';
                    saveToLocalStorage('jogadores', todos);
                    renderizarJogadores(clubeId, container);
                }
            });
        }

        container.appendChild(card);
    });
}

