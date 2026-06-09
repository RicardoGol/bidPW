import { ClubesPorEstado } from "./dados.js";

const estadoBusca = document.querySelector('#estado-busca');
const clubeBusca = document.querySelector('#clube-busca');
const botaoBusca = document.querySelector('#botao-busca');
/* Vou precisar pra pegar os ids */

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
function buscaClube() {
    
}
estadoBusca.addEventListener('change', atualizarClubes);