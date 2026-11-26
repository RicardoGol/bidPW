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

export async function renderizarJogadores(clubeId, container, podeRescindir = false) {
    const resposta = await fetch(`php/api/listar_jogadores.php?clube_id=${clubeId}`)
    const filtrados = await resposta.json();
    container.innerHTML = '';

    if (filtrados.length === 0) {
        container.innerHTML = '<p class="sem-jogadores">Nenhum jogador registrado neste clube.</p>';
        return;
    }

    filtrados.forEach(jogador => {
        const card = document.createElement('div');
        card.classList.add('card-jogador');
        if (jogador.contrato.tipo.toLowerCase() === 'rescisao') {
            card.classList.add('card-rescindido');
        }
        const botaoRescindir = (podeRescindir && jogador.contrato.tipo.toLowerCase() !== 'rescisao') ? `
            <button class="botao-rescindir" data-id="${jogador.id}">Rescindir</button>
        ` : '';

            card.innerHTML = `
            <div class="card-header">
                ${jogador.foto ? `<img src="${jogador.foto}" class="card-foto">` : '<div class="card-foto-placeholder"></div>'}
                <div>
                    <span class="card-nome">${jogador.nome}: ${jogador.contrato.numero}</span>
                    <span class="card-apelido">${jogador.apelido || ''}</span>
                </div>
            </div>
            <div class="card-info">
                <span><strong>Clube:</strong> ${jogador.clube.name}</span>
                <span><strong>Série:</strong> ${jogador.clube.division}</span>
                <span><strong>Contrato:</strong> ${jogador.contrato.tipo}</span>
                <span><strong>Início:</strong> ${jogador.contrato.inicio}</span>
                <span><strong>Inscrição:</strong> ${jogador.contrato.inscricao}</span>
                <span><strong>Nascimento:</strong> ${jogador.nascimento}</span>
            </div>
            ${botaoRescindir}`
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('botao-rescindir')) return;
                abrirModalEstatisticas(jogador.id);
            });

        // Adiciona o evento no botão de rescindir
            const btn = card.querySelector('.botao-rescindir');
            if (btn) {
            btn.addEventListener('click', async () => {
                const resposta = await fetch('php/api/rescindir_jogador.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: jogador.id })     // lacuna: o id deste jogador
                });
                const resultado = await resposta.json();               // lacuna: abrir a bandeja

                if (resultado.erro) {
                    showToast(resultado.erro, 'error');
                    return;
                }
                renderizarJogadores(clubeId, container, podeRescindir);
            });
            }


        container.appendChild(card);
    });
}

export async function abrirModalEstatisticas(jogadorId) {
    const resposta = await fetch(`php/api/buscar_jogador.php?id=${jogadorId}`)
    const jogador = await resposta.json();

    const respostaStats = await fetch(`php/api/estatisticas_jogador.php?id=${jogadorId}`);
    const stats = await respostaStats;     // lacuna: abrir a bandeja

    // Preenche o modal
    document.querySelector('#stats-nome').textContent = jogador.nome;
    document.querySelector('#stats-apelido').textContent = jogador.apelido || '';
    document.querySelector('#stats-partidas').textContent = stats.partidas;
    document.querySelector('#stats-gols').textContent = stats.gols;
    document.querySelector('#stats-assistencias').textContent = stats.assistencias;
    document.querySelector('#stats-amarelo').textContent = stats.amarelos;
    document.querySelector('#stats-vermelho').textContent = stats.vermelhos;
    document.querySelector('#stats-substituicoes').textContent = stats.substituicoes;

    document.querySelector('#overlay-modal-stats').classList.add('ativo');
}