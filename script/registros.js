import { ClubesPorEstado } from "./dados.js";
import { showToast, saveToLocalStorage, loadFromLocalStorage } from "./utils.js";
import { renderizarJogadores } from './utils.js';

const estadoBusca = document.querySelector('#estado-busca');
const clubeBusca = document.querySelector('#clube-busca');
const botaoBusca = document.querySelector('#botao-busca');
const botaoAbrirModal = document.querySelector('#botao-abrir-modal');
const botaoFecharModal = document.querySelector('#botao-fechar-modal');
const overlayModal = document.querySelector('#overlay-modal');
const botaoConfirmar = document.querySelector('#botao-confirmar-registro');

const JOGADORES_KEY = 'jogadores';

// ── CLUBES ──
function atualizarClubes() {
    const estadoSelecionado = estadoBusca.value;
    clubeBusca.innerHTML = '<option value="">Todos os clubes</option>';
    if (!estadoSelecionado || !ClubesPorEstado[estadoSelecionado]) return;
    ClubesPorEstado[estadoSelecionado].forEach(clube => {
        const option = document.createElement('option');
        option.value = clube.id;
        option.textContent = `${clube.name} (Série ${clube.division}) (ID ${clube.id})`;
        clubeBusca.appendChild(option);
    });
}

estadoBusca.addEventListener('change', atualizarClubes);

// ── MODAL ──
var modalHabilitado = false;

clubeBusca.addEventListener('change', () => {
    modalHabilitado = clubeBusca.value !== '';
    if (modalHabilitado) {
        botaoAbrirModal.classList.remove('desabilitado');
    } else {
        botaoAbrirModal.classList.add('desabilitado');
    }
});

botaoAbrirModal.addEventListener('click', () => {
    if (!modalHabilitado) {
        showToast('Selecione um clube primeiro!', 'error');
        return;
    }
    overlayModal.classList.add('ativo');
});

botaoFecharModal.addEventListener('click', () => {
    overlayModal.classList.remove('ativo');
});

overlayModal.addEventListener('click', (e) => {
    if (e.target === overlayModal) overlayModal.classList.remove('ativo');
});

// ── REGISTRO ──
function registrarJogador() {
    const nome = document.querySelector('#registrar-nome').value.trim();
    const apelido = document.querySelector('#registrar-apelido').value.trim();
    const nascimento = document.querySelector('#registrar-nascimento').value;
    const contrato = document.querySelector('#registrar-contrato').value.trim();
    const tipo = document.querySelector('#tipoContrato').value;
    const publicacao = document.querySelector('#registrar-publicacao').value;
    const inicio = document.querySelector('#registrar-inicio').value;
    const inscricao = document.querySelector('#registrar-inscricao').value;
    
    // Validação básica
    if (!nome || !nascimento || !contrato || !publicacao || !inicio || !inscricao) {
        showToast('Preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    // Busca o clube selecionado nos dados
    const estadoSelecionado = estadoBusca.value;
    const clubeId = parseInt(clubeBusca.value);
    const clube = ClubesPorEstado[estadoSelecionado].find(c => c.id === clubeId);
    
    const jogadores = loadFromLocalStorage(JOGADORES_KEY);
    
    const novoJogador = {
        id: Date.now(), // id único baseado no timestamp
        nome,
        apelido,
        nascimento,
        contrato: {
            numero: contrato,
            tipo,
            publicacao,
            inicio,
            inscricao: parseInt(inscricao)
        },
        clube,
        ativo: true
    };
    
    jogadores.push(novoJogador);
    saveToLocalStorage(JOGADORES_KEY, jogadores);
    
    showToast(`${nome} registrado com sucesso!`, 'success');
    overlayModal.classList.remove('ativo');
    document.querySelector('#registrar-nome').value = '';
    document.querySelector('#registrar-apelido').value = '';
    document.querySelector('#registrar-nascimento').value = '';
    document.querySelector('#registrar-contrato').value = '';
    document.querySelector('#tipoContrato').value = 'definitivo';
    document.querySelector('#registrar-publicacao').value = '';
    document.querySelector('#registrar-inicio').value = '';
    document.querySelector('#registrar-inscricao').value = '';
}

botaoConfirmar.addEventListener('click', registrarJogador);

botaoBusca.addEventListener('click', () => {
    if (clubeBusca.value == '') {
        showToast('Selecione um clube!', 'error');
        return;
    }
    const container = document.querySelector('#lista-jogadores');
    container.style.display = 'grid'; /* mostra ao buscar */
    renderizarJogadores(clubeBusca.value, container);
});