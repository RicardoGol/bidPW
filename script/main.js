import { ClubesPorEstado } from "./dados.js";
import { showToast, renderizarJogadores, abrirModalEstatisticas} from './utils.js';

const estadoBusca = document.querySelector('#estado-busca');
const dataBusca= document.querySelector('#data-busca');
const clubeBusca = document.querySelector('#clube-busca');
const botaoBusca = document.querySelector('#botao-busca');
const botao_login = document.querySelector('#botao_login')
/* buscaEstados */

function atualizarClubes() {
    const estadoSelecionado = estadoBusca.value;
    
    // Limpa as opções atuais
    clubeBusca.innerHTML = '<option value="">Todos os clubes</option>';
    
    if (!estadoSelecionado || !ClubesPorEstado[estadoSelecionado]) return;
    
    const clubes = ClubesPorEstado[estadoSelecionado];
    
    clubes.forEach(clube => {
        const option = document.createElement('option');
        option.value = clube.id;
        option.textContent = `${clube.name} (Série ${clube.division}) (ID ${clube.id})`;
        clubeBusca.appendChild(option);
    });
}

// Escuta a mudança no select de estado
botaoBusca.addEventListener('click', () => {
    if (clubeBusca.value == '') {
        showToast('Selecione um clube!', 'error');
        return;
    }
    const container = document.querySelector('#lista-jogadores');
    container.style.display = 'grid';
    renderizarJogadores(clubeBusca.value, container);
});
estadoBusca.addEventListener('change', atualizarClubes);

botao_login.addEventListener('click', ()=>{
    const autenticado = localStorage.getItem('autenticado') || sessionStorage.getItem('autenticado');
    if (!autenticado) {
        window.location.href = './PaginaLogin.html';
    }
    else{
        window.location.href = './PaginaRegistros.html';
    }
})

document.querySelector('#botao-fechar-stats').addEventListener('click', () => {
    document.querySelector('#overlay-modal-stats').classList.remove('ativo');
});

document.querySelector('#overlay-modal-stats').addEventListener('click', (e) => {
    if (e.target === document.querySelector('#overlay-modal-stats')) {
        document.querySelector('#overlay-modal-stats').classList.remove('ativo');
    }
});
