import { ClubesPorEstado } from "./dados.js";
import { showToast, saveToLocalStorage, loadFromLocalStorage } from "./utils.js";

const JOGADORES_KEY = 'jogadores';
const PARTIDAS_KEY = 'partidas';

// ── ELEMENTOS ──
const overlayModalPartida = document.querySelector('#overlay-modal-partida');
const botaoFecharModalPartida = document.querySelector('#botao-fechar-modal-partida');
const botaoProximaEtapa = document.querySelector('#botao-proxima-etapa');
const botaoEtapaAnterior = document.querySelector('#botao-etapa-anterior');
const botaoConfirmarPartida = document.querySelector('#botao-confirmar-partida');
const etapa1 = document.querySelector('#etapa-1');
const etapa2 = document.querySelector('#etapa-2');

const estadoBusca = document.querySelector('#estado-busca');
const clubeBusca = document.querySelector('#clube-busca');

const partidaEstadoVisitante = document.querySelector('#partida-estado-visitante');
const partidaClubeVisitante = document.querySelector('#partida-clube-visitante');
const contadorTitulares = document.querySelector('#contador-titulares');
const contadorReservas = document.querySelector('#contador-reservas');
const listaSelecaoTitulares = document.querySelector('#lista-selecao-titulares');
const listaSelecaoReservas = document.querySelector('#lista-selecao-reservas');
const listaStatsJogadores = document.querySelector('#lista-stats-jogadores');

// ── ABRIR/FECHAR MODAL ──
export function abrirModalPartida(clubeId) {
    overlayModalPartida.classList.add('ativo');
    etapa1.style.display = 'block';
    etapa2.style.display = 'none';
    carregarJogadoresParaSelecao(clubeId);
}

function fecharModalPartida() {
    overlayModalPartida.classList.remove('ativo');
    limparModal();
}

botaoFecharModalPartida.addEventListener('click', fecharModalPartida);
overlayModalPartida.addEventListener('click', (e) => {
    if (e.target === overlayModalPartida) fecharModalPartida();
});

// ── VISITANTE ──
partidaEstadoVisitante.addEventListener('change', () => {
    const estado = partidaEstadoVisitante.value;
    partidaClubeVisitante.innerHTML = '<option value="">Selecione o clube</option>';
    if (!estado || !ClubesPorEstado[estado]) return;
    ClubesPorEstado[estado].forEach(clube => {
        const option = document.createElement('option');
        option.value = clube.id;
        option.textContent = `${clube.name} (Série ${clube.division})`;
        partidaClubeVisitante.appendChild(option);
    });
});

// ── CARREGAR JOGADORES ──
function carregarJogadoresParaSelecao(clubeId) {
    const jogadores = loadFromLocalStorage(JOGADORES_KEY);
    const ativos = jogadores.filter(j =>
        j.clube.id === parseInt(clubeId) &&
        j.ativo &&
        j.contrato.tipo.toLowerCase() !== 'rescisao'
    );

    listaSelecaoTitulares.innerHTML = '';
    listaSelecaoReservas.innerHTML = '';

    if (ativos.length < 11) {
        listaSelecaoTitulares.innerHTML = '<p class="aviso-modal">Este clube não tem jogadores suficientes para registrar uma partida (mín. 11).</p>';
        botaoProximaEtapa.disabled = true;
        return;
    }

    botaoProximaEtapa.disabled = false;

    ativos.forEach(jogador => {
        // Titular
        const itemTitular = document.createElement('div');
        itemTitular.classList.add('item-selecao');
        itemTitular.innerHTML = `
            <input type="checkbox" id="titular-${jogador.id}" class="check-titular" data-id="${jogador.id}">
            <label for="titular-${jogador.id}">${jogador.nome} <span>${jogador.apelido || ''}</span></label>
        `;
        listaSelecaoTitulares.appendChild(itemTitular);

        // Reserva
        const itemReserva = document.createElement('div');
        itemReserva.classList.add('item-selecao');
        itemReserva.innerHTML = `
            <input type="checkbox" id="reserva-${jogador.id}" class="check-reserva" data-id="${jogador.id}">
            <label for="reserva-${jogador.id}">${jogador.nome} <span>${jogador.apelido || ''}</span></label>
        `;
        listaSelecaoReservas.appendChild(itemReserva);
    });

    // Atualiza contadores e impede seleção dupla
    document.querySelectorAll('.check-titular').forEach(check => {
        check.addEventListener('change', () => {
            const id = check.dataset.id;
            const reservaCheck = document.querySelector(`#reserva-${id}`);
            const totalTitulares = document.querySelectorAll('.check-titular:checked').length;

            if (check.checked && totalTitulares > 11) {
                check.checked = false;
                showToast('Máximo de 11 titulares!', 'error');
                return;
            }

            if (check.checked) reservaCheck.disabled = true;
            else reservaCheck.disabled = false;
            atualizarContadores();
        });
    });

    document.querySelectorAll('.check-reserva').forEach(check => {
        check.addEventListener('change', () => {
            const id = check.dataset.id;
            const titularCheck = document.querySelector(`#titular-${id}`);
            const totalReservas = document.querySelectorAll('.check-reserva:checked').length;

            if (check.checked && totalReservas > 12) {
                check.checked = false;
                showToast('Máximo de 12 reservas!', 'error');
                return;
            }

            if (check.checked) titularCheck.disabled = true;
            else titularCheck.disabled = false;
            atualizarContadores();
        });
    });
}

function atualizarContadores() {
    const totalTitulares = document.querySelectorAll('.check-titular:checked').length;
    const totalReservas = document.querySelectorAll('.check-reserva:checked').length;
    contadorTitulares.textContent = `(${totalTitulares}/11)`;
    contadorReservas.textContent = `(${totalReservas}/12)`;
}

// ── ETAPA 2: STATS ──
botaoProximaEtapa.addEventListener('click', () => {
    const data = document.querySelector('#partida-data').value;
    const visitanteId = partidaClubeVisitante.value;
    const totalTitulares = document.querySelectorAll('.check-titular:checked').length;
    const totalReservas = document.querySelectorAll('.check-reserva:checked').length;

    if (!data) {
        showToast('Informe a data da partida!', 'error');
        return;
    }
    if (!visitanteId) {
        showToast('Selecione o clube visitante!', 'error');
        return;
    }
    if (totalTitulares < 11) {
        showToast(`Selecione pelo menos 11 titulares! (${totalTitulares}/11)`, 'error');
        return;
    }
    if (totalReservas > 12) {
        showToast('Máximo de 12 reservas!', 'error');
        return;
    }

    etapa1.style.display = 'none';
    etapa2.style.display = 'block';
    renderizarStatsJogadores();
});

botaoEtapaAnterior.addEventListener('click', () => {
    etapa2.style.display = 'none';
    etapa1.style.display = 'block';
});

function renderizarStatsJogadores() {
    listaStatsJogadores.innerHTML = '';
    const jogadores = loadFromLocalStorage(JOGADORES_KEY);

    const titularIds = [...document.querySelectorAll('.check-titular:checked')].map(c => parseInt(c.dataset.id));
    const reservaIds = [...document.querySelectorAll('.check-reserva:checked')].map(c => parseInt(c.dataset.id));

    const renderGrupo = (ids, titulo) => {
        const header = document.createElement('p');
        header.classList.add('stats-grupo-titulo');
        header.textContent = titulo;
        listaStatsJogadores.appendChild(header);

        ids.forEach(id => {
            const jogador = jogadores.find(j => j.id === id);
            if (!jogador) return;

            const item = document.createElement('div');
            item.classList.add('item-stats');
            item.dataset.id = jogador.id;
            item.innerHTML = `
                <p class="stats-nome">${jogador.nome} <span>${jogador.apelido || ''}</span></p>
                <div class="stats-campos">
                    <label>Gols
                        <input type="number" class="stat-gols" min="0" value="0">
                    </label>
                    <label>Assistências
                        <input type="number" class="stat-assistencias" min="0" value="0">
                    </label>
                    <label class="stat-check">
                        <input type="checkbox" class="stat-amarelo"> Cartão Amarelo
                    </label>
                    <label class="stat-check">
                        <input type="checkbox" class="stat-vermelho"> Cartão Vermelho
                    </label>
                    <label>Substituição
                        <select class="stat-substituicao">
                            <option value="">Nenhuma</option>
                            <option value="saiu">Saiu</option>
                            <option value="entrou">Entrou</option>
                        </select>
                    </label>
                </div>
            `;
            listaStatsJogadores.appendChild(item);
        });
    };

    renderGrupo(titularIds, 'TITULARES');
    if (reservaIds.length > 0) renderGrupo(reservaIds, 'RESERVAS');
}

// ── CONFIRMAR PARTIDA ──
botaoConfirmarPartida.addEventListener('click', () => {
    const data = document.querySelector('#partida-data').value;
    const visitanteId = parseInt(partidaClubeVisitante.value);
    const visitanteEstado = partidaEstadoVisitante.value;
    const clubeVisitante = ClubesPorEstado[visitanteEstado]?.find(c => c.id === visitanteId);

    const mandanteId = parseInt(clubeBusca.value);
    const mandanteEstado = estadoBusca.value;
    const clubeMandante = ClubesPorEstado[mandanteEstado]?.find(c => c.id === mandanteId);

    const jogadores = loadFromLocalStorage(JOGADORES_KEY);
    const titularIds = [...document.querySelectorAll('.check-titular:checked')].map(c => parseInt(c.dataset.id));
    const reservaIds = [...document.querySelectorAll('.check-reserva:checked')].map(c => parseInt(c.dataset.id));

    const coletarStats = (ids) => ids.map(id => {
        const jogador = jogadores.find(j => j.id === id);
        const item = listaStatsJogadores.querySelector(`.item-stats[data-id="${id}"]`);
        return {
            id: jogador.id,
            nome: jogador.nome,
            apelido: jogador.apelido,
            gols: parseInt(item.querySelector('.stat-gols').value) || 0,
            assistencias: parseInt(item.querySelector('.stat-assistencias').value) || 0,
            cartaoAmarelo: item.querySelector('.stat-amarelo').checked,
            cartaoVermelho: item.querySelector('.stat-vermelho').checked,
            substituicao: item.querySelector('.stat-substituicao').value || null
        };
    });

    const novaPartida = {
        id: Date.now(),
        data,
        mandante: {
            clube: clubeMandante,
            titulares: coletarStats(titularIds),
            reservas: coletarStats(reservaIds)
        },
        visitante: {
            clube: clubeVisitante
        }
    };

    const partidas = loadFromLocalStorage(PARTIDAS_KEY);
    partidas.push(novaPartida);
    saveToLocalStorage(PARTIDAS_KEY, partidas);

    showToast('Partida registrada com sucesso!', 'success');
    fecharModalPartida();
});

// ── LIMPAR MODAL ──
function limparModal() {
    document.querySelector('#partida-data').value = '';
    partidaEstadoVisitante.value = '';
    partidaClubeVisitante.innerHTML = '<option value="">Selecione o estado primeiro</option>';
    listaSelecaoTitulares.innerHTML = '';
    listaSelecaoReservas.innerHTML = '';
    listaStatsJogadores.innerHTML = '';
    contadorTitulares.textContent = '(0/11)';
    contadorReservas.textContent = '(0/12)';
    etapa1.style.display = 'block';
    etapa2.style.display = 'none';
}