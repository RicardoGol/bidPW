import { ClubesPorEstado } from "./dados.js";
import { showToast, saveToLocalStorage, loadFromLocalStorage, renderizarJogadores } from "./utils.js";
import { abrirModalPartida } from './partidas.js';

const estadoBusca = document.querySelector('#estado-busca');
const clubeBusca = document.querySelector('#clube-busca');
const botaoBusca = document.querySelector('#botao-busca');
const botaoAbrirModal = document.querySelector('#botao-abrir-modal');
const botaoFecharModal = document.querySelector('#botao-fechar-modal');
const overlayModal = document.querySelector('#overlay-modal');
const botaoConfirmar = document.querySelector('#botao-confirmar-registro')
const botaoLogout = document.querySelector('#logout');

const JOGADORES_KEY = 'jogadores';


botaoLogout.addEventListener('click', () =>{
    localStorage.removeItem('autenticado');
    sessionStorage.removeItem('autenticado');
    window.location.href = './Index.html'
})
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
        document.querySelector('#botao-abrir-modal-partida').classList.remove('desabilitado');
    } else {
        botaoAbrirModal.classList.add('desabilitado');
        document.querySelector('#botao-abrir-modal-partida').classList.add('desabilitado');
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
    const contrato = document.querySelector('#registrar-contrato').value.trim();
    const tipo = document.querySelector('#tipoContrato').value;
    const publicacao = document.querySelector('#registrar-publicacao').value;
    const inicio = document.querySelector('#registrar-inicio').value;
    const inscricao = document.querySelector('#registrar-inscricao').value;
    const fotoInput = document.querySelector('#registrar-foto');

    if (!nome || !nascimento || !contrato || !publicacao || !inicio || !inscricao) {
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

    const estadoSelecionado = estadoBusca.value;
    const clubeId = parseInt(clubeBusca.value);
    const clube = ClubesPorEstado[estadoSelecionado].find(c => c.id === clubeId);

    const jogadores = loadFromLocalStorage(JOGADORES_KEY);

    const novoJogador = {
        id: Date.now(),
        nome,
        apelido,
        nascimento,
        foto: fotoBase64, // null se não tiver foto
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
    document.querySelector('#registrar-foto').value = '';
    const container = document.querySelector('#lista-jogadores');
    container.style.display = 'grid';
    renderizarJogadores(clubeBusca.value, container, true);
}

botaoConfirmar.addEventListener('click', registrarJogador);

const botaoAbrirModalPartida = document.querySelector('#botao-abrir-modal-partida');
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

const apresentacao_teste = document.getElementById('apresentacao-add')
const botao_teste = document.createElement('button')
botao_teste.textContent = 'Adicionar jogadores'
botao_teste.classList.add('botao-voltar')
apresentacao_teste.appendChild(botao_teste)

botao_teste.addEventListener('click', () =>{

    const estadoSelecionado = estadoBusca.value;
    const clubeId = parseInt(clubeBusca.value);
    if (!estadoSelecionado || !ClubesPorEstado[estadoSelecionado]) {
        showToast('Selecione um estado!', 'error');
        return;
    }

    const clube = ClubesPorEstado[estadoSelecionado].find(c => c.id === clubeId);
    if (!clube) {
        showToast('Selecione um clube!', 'error');
        return;
    }

    const jogadores = loadFromLocalStorage(JOGADORES_KEY);
    
    const novoJogador = [{
        id: Date.now() -1,
        nome: 'Vinicius Tavares Guimarães',
        apelido: 'Guimarães',
        nascimento: '1979-05-12',
        contrato: {
            numero: 10,
            tipo: 'definitivo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(1)
        },
        clube,
        ativo: true,
    },
        {
        id: Date.now(),
        nome: 'Sergio Yoshimitsu Fujii',
        apelido: 'Fujii',
        nascimento: '1982-06-28',
        contrato: {
            numero: 2,
            tipo: 'definitivo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(2)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 1,
        nome: 'Sophia Pradella Pereira',
        apelido: 'Pradella',
        nascimento: '2009-06-17',
        contrato: {
            numero: 67,
            tipo: 'definitivo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(3)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 2,
        nome: 'Lara Oliveira Menezes',
        apelido: 'Lara',
        nascimento: '2008-08-28',
        contrato: {
            numero: 25,
            tipo: 'definitivo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(4)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 3,
        nome: 'Marina da Silva Pereira',
        apelido: 'Nina',
        nascimento: '2009-10-26',
        contrato: {
            numero: 26,
            tipo: 'definitivo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(5)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 4,
        nome: 'Manuela Gonçalvaes Cairuga',
        apelido: 'Gonçalves',
        nascimento: '2009-08-14',
        contrato: {
            numero: 69,
            tipo: 'definitivo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(6)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 5,
        nome: 'Nicolas Vieira Madrid',
        apelido: 'Madrid',
        nascimento: '2006-12-13',
        contrato: {
            numero: 4,
            tipo: 'definitivo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(7)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 6,
        nome: 'Isabella Lima Lopes',
        apelido: 'Isa Lopes',
        nascimento: '2009-06-22',
        contrato: {
            numero: 22,
            tipo: 'emprestimo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(8)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 7,
        nome: 'Fillipe de Souza Machado',
        apelido: 'Fillipe',
        nascimento: '2010-03-30',
        contrato: {
            numero: 9,
            tipo: 'emprestimo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(9)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 12,
        nome: 'Altemir Silva da Silva',
        apelido: 'Altamir',
        nascimento: '2009-03-17',
        contrato: {
            numero: 6,
            tipo: 'emprestimo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(12)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 13,
        nome: 'Kamily Silva Naatz',
        apelido: 'Kemily',
        nascimento: '2009-03-17',
        contrato: {
            numero: 7,
            tipo: 'emprestimo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(13)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 8,
        nome: 'Max',
        apelido: 'Max',
        nascimento: '2009-04-13',
        contrato: {
            numero: 20,
            tipo: 'emprestimo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(50)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 9,
        nome: 'Lukas da Silva Nogueira',
        apelido: 'Lukinhas',
        nascimento: '2010-06-18',
        contrato: {
            numero: 0,
            tipo: 'emprestimo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(10)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 10,
        nome: 'Gustavo Kazanowski Netto',
        apelido: 'Kazanowski',
        nascimento: '2009-10-20',
        contrato: {
            numero: 11,
            tipo: 'emprestimo',
            publicacao: '2026-06-22',
            inicio: '2026-06-26',
            inscricao: parseInt(11)
        },
        clube,
        ativo: true,
    },
    {
        id: Date.now() + 11,
        nome: 'AnaitaT',
        apelido: 'Anaitat',
        nascimento: '2000-01-01',
        contrato: {
            numero: 99,
            tipo: 'rescisao',
            publicacao: '2026-01-22',
            inicio: '2026-01-26',
            inscricao: parseInt(80)
        },
        clube,
        ativo: true,
    },];
    novoJogador.forEach((jogador) =>{
        jogadores.push(jogador);
    })
    saveToLocalStorage(JOGADORES_KEY, jogadores);
    
    showToast(`jogadores registrados com sucesso!`, 'success');
    apresentacao_teste.remove();
    const container = document.querySelector('#lista-jogadores');
    container.style.display = 'grid';
    renderizarJogadores(clubeBusca.value, container, true);
})

// [{"id":1782173424520,"nome":"asa","apelido":"sa","nascimento":"2026-06-24","contrato":{"numero":"21","tipo":"emprestimo","publicacao":"2026-06-11","inicio":"2026-06-05","inscricao":2121},"clube":{"id":2,"name":"Coritiba","division":"A"},"ativo":true}]