import { showToast, renderizarJogadores } from "./utils.js";
import { abrirModalPartida } from './partidas.js';

const estadoBusca = document.querySelector('#estado-busca');
const clubeBusca = document.querySelector('#clube-busca');
const botaoBusca = document.querySelector('#botao-busca');
const botaoAbrirModal = document.querySelector('#botao-abrir-modal');
const botaoFecharModal = document.querySelector('#botao-fechar-modal');
const overlayModal = document.querySelector('#overlay-modal');
const botaoConfirmar = document.querySelector('#botao-confirmar-registro')
const botaoLogout = document.querySelector('#logout');
const botaoAbrirModalPartida = document.querySelector('#botao-abrir-modal-partida');

// ao carregar: barra quem não está logado
const sessao = await (await fetch('php/api/verificar_sessao.php')).json();
if (!sessao.logado) {
    window.location.href = './PaginaLogin.html';
}

botaoLogout.addEventListener('click', async () => {
    await fetch('php/api/logout.php');
    window.location.href = './Index.html';
});
// ── CLUBES ──
async function atualizarClubes() {
    const estadoSelecionado = estadoBusca.value;
    
    // Limpa as opções atuais
    clubeBusca.innerHTML = '<option value="">Todos os clubes</option>';
    
    if (!estadoSelecionado) return;
    const resposta = await fetch(`php/api/listar_clubes.php?estado=${estadoSelecionado}`)
    const clubes = await resposta.json();
    
    clubes.forEach(clube => {
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
            botaoAbrirModalPartida.classList.remove('desabilitado');
        } else {
            botaoAbrirModal.classList.add('desabilitado');
            botaoAbrirModalPartida.classList.add('desabilitado');
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
async function registrarJogador() {
    const nome = document.querySelector('#registrar-nome').value.trim();
    const apelido = document.querySelector('#registrar-apelido').value.trim();
    const nascimento = document.querySelector('#registrar-nascimento').value;
    const camisa = document.querySelector('#registrar-camisa').value.trim();
    const tipo = document.querySelector('#tipoContrato').value;
    const publicacao = document.querySelector('#registrar-publicacao').value;
    const inicio = document.querySelector('#registrar-inicio').value;
    const inscricao = document.querySelector('#registrar-inscricao').value;
    const fotoInput = document.querySelector('#registrar-foto');

    if (!nome || !nascimento || !camisa || !publicacao || !inicio || !inscricao) {
        showToast('Preencha todos os campos obrigatórios!', 'error');
        return;
    }

    // Converte foto para base64 se tiver uma
    let fotoBase64 = null;
    if (fotoInput.files[0]) {
        fotoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(fotoInput.files[0]);
        });
    }

const resposta = await fetch('php/api/registrar_jogador.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nome,
        apelido,
        nascimento,
        foto: fotoBase64,
        camisa,
        tipo,
        publicacao,
        inicio,
        inscricao,
        clube_id: parseInt(clubeBusca.value)         // lacuna: o número do clube escolhido
    })
});
const resultado = await resposta.json();   // lacuna: abrir a bandeja

if (resultado.erro) {
    showToast(resultado.erro, 'error');
    return;
}

showToast(`${nome} registrado com sucesso!`, 'success');
// o resto (fechar modal, limpar campos, renderizarJogadores) continua igual

    overlayModal.classList.remove('ativo');
    document.querySelector('#registrar-nome').value = '';
    document.querySelector('#registrar-apelido').value = '';
    document.querySelector('#registrar-nascimento').value = '';
    document.querySelector('#registrar-camisa').value = '';
    document.querySelector('#tipoContrato').value = 'definitivo';
    document.querySelector('#registrar-publicacao').value = '';
    document.querySelector('#registrar-inicio').value = '';
    document.querySelector('#registrar-inscricao').value = '';
    document.querySelector('#registrar-foto').value = '';
    const container = document.querySelector('#lista-jogadores');
    container.style.display = 'grid';
    renderizarJogadores(clubeBusca.value, container, true);
}

botaoConfirmar.addEventListener('click', registrarJogador);

botaoAbrirModalPartida.addEventListener('click', () => {
    if (!modalHabilitado) {
        showToast('Selecione um clube primeiro!', 'error');
        return;
    }
    abrirModalPartida(clubeBusca.value);
});

botaoBusca.addEventListener('click', () => {
    if (clubeBusca.value == '') {
        showToast('Selecione um clube!', 'error');
        return;
    }
    const container = document.querySelector('#lista-jogadores');
    container.style.display = 'grid'; /* mostra ao buscar */
    renderizarJogadores(clubeBusca.value, container, true);
});

document.querySelector('#botao-fechar-stats').addEventListener('click', () => {
    document.querySelector('#overlay-modal-stats').classList.remove('ativo');
});

document.querySelector('#overlay-modal-stats').addEventListener('click', (e) => {
    if (e.target === document.querySelector('#overlay-modal-stats')) {
        document.querySelector('#overlay-modal-stats').classList.remove('ativo');
    }
});
