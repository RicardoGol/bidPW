const estadoBusca = document.querySelector('#estado-busca');
const dataBusca= document.querySelector('#data-busca');
const clubeBusca = document.querySelector('#clube-busca');
const botaoBusca = document.querySelector('#botao-busca');
/* buscaEstados */
//Sul
const ClubesPorEstado = {
    'Parana': [
    {id:1, name:'Athletico Paranaense', division: 'A' },
    {id:2, name:'Coritiba', division: 'A' },
    {id:3, name:'Operário', division: 'B' },
    {id:4, name:'Londrina', division: 'B' }
],
    'Rio Grande do Sul': [
    {id:5, name:'Internacional', division: 'A'},
    {id:6, name:'Grêmio', division: 'A'},
    {id:7, name:'Juventude', division: 'B'},
    {id:8, name:'Caxias', division: 'C'},
    {id:9, name:'Ypiranga', division: 'C'},
    {id:10, name:'Brasil de Pelotas', division: 'D'},
    {id:11, name:'Guarany de Bagé', division: 'D'},
    {id:12, name:'São José', division: 'D'},
    {id:13, name:'São Luiz', division: 'D'}
],
    'Santa Catarina': [
    {id:14, name:'Chapecoense', division: 'A'},
    {id:15, name:'Avai', division: 'B'},
    {id:16, name:'Criciuma', division: 'B'},
    {id:17, name:'Barra', division: 'C'},
    {id:18, name:'Brusque', division: 'C'},
    {id:19, name:'Figueirense', division: 'C'},
    {id:20, name:'Blumenau', division: 'D'},
    {id:21, name:'Joinville', division: 'D'},
    {id:22, name:'Marcílio dias', division: 'D'},
    {id:23, name:'Santa catarina', division:'D'}
],
//Sudeste
    'Espirito Santo': [
    {id:24, name:'Rio Branco', division: 'D'},
    {id:25, name:'Vitoria-ES', division: 'D'},
    {id:26, name:'Real Noroeste', division: 'D'},
],
    'Minas Gerais': [
    {id:27, name:'Atlético Mineiro', division: 'A'},
    {id:28, name:'Cruzeiro', division: 'A'},
    {id:29, name:'América Mineiro', division: 'B'},
    {id:30, name:'Athletic', division: 'B'},
    {id:31, name:'Betim', division: 'D'},
    {id:32, name:'Democrata', division: 'D'},
    {id:33, name:'Pouso Alegre', division: 'D'},
    {id:34, name:'Tombense', division: 'D'},
    {id:35, name:'Uberlândia', division: 'D'}
],
    'Rio de Janeiro': [
    {id:36, name:'Botafogo', division: 'A'},
    {id:37, name:'Flamengo', division: 'A'},
    {id:38, name:'Fluminense', division: 'A'},
    {id:39, name:'Vasco', division: 'A'},
    {id:40, name:'Volta Redonda', division: 'C'},
    {id:41, name:'America-RJ', division: 'D'},
    {id:42, name:'Madureira', division: 'D'},
    {id:43, name:'Maricá', division: 'D'},
    {id:44, name:'Nova Iguacu', division: 'D'},
    {id:45, name:'Portuguesa-RJ', division:'D'},
    {id:46, name:'Samapaio Corrêa', division:'D'}
],
    'Sao Paulo': [
    {id:47, name:'Corinthians', division: 'A'},
    {id:48, name:'Palmeiras', division: 'A'},
    {id:49, name:'Bragantino', division: 'A'},
    {id:50, name:'Santos', division: 'A'},
    {id:51, name:'São Paulo', division: 'A'},
    {id:52, name:'Mirassol', division: 'A'},
    {id:53, name:'Botafogo-SP', division: 'B'},
    {id:56, name:'Novorizontino', division:'B'},
    {id:57, name:'Ponte Preta', division:'B'},
    {id:58, name:'São Bernardo', division: 'B'},
    {id:59, name:'Guarani', division: 'C'},
    {id:60, name:'Ituano', division: 'C'},
    {id:61, name:'Ferroviaria', division: 'C'},
    {id:62, name:'Inter de Limeira', division:'C'},
    {id:63, name:'Portuguesa', division: 'D'},
    {id:64, name:'Oeste', division: 'D'},
    {id:65, name:'Santo André', division: 'D'},
    {id:66, name:'Água Santa', division:'D'},
    {id:67, name:'Velo Clube', division: 'D'}
],
//Centro-Oeste
    'Distrito Federal': [
    {id:68, name:'Brasiliense', division:'D'},
    {id:69, name:'Capital-DF', division:'D'}
],
    'Goias': [
    {id:70, name:'Atlético-GO', division: 'B'},
    {id:71, name:'Goiás', division: 'B'},
    {id:72, name:'Vila Nova', division: 'B'},
    {id:73, name:'Anápolis', division: 'C'},
    {id:74, name:'Abecat', division: 'D'},
    {id:75, name:'Aparecidense', division: 'D'},
    {id:76, name:'CRAC', division: 'D'},
    {id:77, name:'Goiatuba', division: 'D'},
    {id:78, name:'Inhumas', division: 'D'}
],
    'Mato grosso do Sul':[
    {id:79, name:'Ivinhema', division: 'D'},
    {id:80, name:'Operário', division: 'D'}
],
    'Mato Grosso': [
    {id:81, name:'Cuiabá', division: 'B'},
    {id:82, name:'Luverdense', division: 'D'},
    {id:83, name:'Mixto', division: 'D'},
    {id:84, name:'União Rondonópolias', division: 'D'}
],
//Nordeste
    'Alagoas':[
    {id:85, name:'CRB', division: 'A'},
    {id:86, name:'ASA', division: 'D'},
    {id:87, name:'CSA', division: 'D'},
    {id:88, name:'CSE', division: 'D'}
],
    'Bahia': [
    {id:89, name:'Bahia', division:'A'},
    {id:90, name:'Vitória', division:'A'}
],
    'Ceara': [
    {id:91, name:'Atlético de Alagoinhas', division: 'D'},
    {id:92, name:'Jacuipense', division: 'D'},
    {id:93, name:'Juazeirense', division: 'D'},
    {id:94, name:'Porto', division: 'D'}
],
    'Maranhao': [
    {id:95, name:'MAC', division: 'C'},
    {id:96, name:'Sampaio Corrêa', division: 'D'},
    {id:97, name:'Moto Club', division: 'D'},
    {id:98, name:'Imperatriz', division: 'D'},
    {id:99, name:'IAPE', division:'D'}
],
    'Paraiba': [
    {id:100, name:'Botafogo-PB', division: 'C'},
    {id:101, name:'Serra Branca', division: 'D'},
    {id:102, name:'Sousa', division: 'D'},
    {id:103, name:'Treze', division: 'D'}
],
    'Pernambuco':  [
    {id:104, name:'Sport', division: 'B'},
    {id:105, name:'Náutico', division: 'B'},
    {id:108, name:'Santa Cruz', division:'C'},
    {id:107, name:'Retrô', division: 'D'},
    {id:106, name:'Central de Caruaru', division: 'D'}
],
    'Piaui': [
    {id:107, name:'Altos', division: 'D'},
    {id:108, name:'Fluminense-PI', division: 'D'},
    {id:109, name:'Parnahyba', division: 'D'},
    {id:110, name:'Piauí', division: 'D'}
],
    'Rio Grande do Norte': [
    {id:111, name:'ABC', division: 'D'},
    {id:112, name:'América-RN', division: 'D'},
    {id:113, name:'Laguna', division: 'D'}
],
    'Sergipe': [
    {id:114, name:'Confiança', division: 'C'},
    {id:115, name:'Sergipe', division: 'D'}
],
//Norte
    'Acre': [
    {id:116, name:'Humaitá', division: 'D'},
    {id:117, name:'Independência', division: 'D'}
],
    'Amazonas': [
    {id:118, name:'Amazonas', division: 'C'},
    {id:119, name:'Manauara', division: 'D'},
    {id:120, name:'Manaus', division: 'D'},
    {id:121, name:'Nacional-AM', division: 'D'}

],
    'Amapa': [
    {id:122, name:'Trem', division: 'D'},
    {id:123, name:'Oratório', division: 'D'}
],
    'Para': [
    {id:124, name:'Remo', division: 'A'},
    {id:125, name:'Paysandu', division: 'C'},
    {id:126, name:'Águia de Marabá', division: 'D'},
    {id:127, name:'Tuna Luso', division: 'D'}

],
    'Roraima': [
    {id:128, name:'GAS', division: 'D'},
    {id:129, name:'Monte Roraima', division: 'D'},
    {id:130, name:'São Raimundo', division: 'D'},
],
    'Rondonia': [
    {id:131, name:'Porto Velho', division: 'D'},
    {id:132, name:'Guaporé', division: 'D'}

],
    'Tocantins': [
    {id:133, name:'Araguaína', division: 'D'},
    {id:134, name:'Tocantinópolis', division: 'D'}

]
}

function atualizarClubes() {
    const estadoSelecionado = estadoBusca.value;

    // Limpa as opções atuais
    clubeBusca.innerHTML = '<option value="">Todos os clubes</option>';

    if (!estadoSelecionado || !ClubesPorEstado[estadoSelecionado]) return;

    const clubes = ClubesPorEstado[estadoSelecionado];

    clubes.forEach(clube => {
        const option = document.createElement('option');
        option.value = clube.id;
        option.textContent = `${clube.name} (Série ${clube.division})`;
        clubeBusca.appendChild(option);
    });
}

// Escuta a mudança no select de estado
function buscaClube() {
    
}
estadoBusca.addEventListener('change', atualizarClubes);