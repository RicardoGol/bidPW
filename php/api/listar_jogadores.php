<?php
header('Content-Type: application/json');
require 'conexao.php';

if (!isset($_GET['clube_id'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}
$clubeId = $_GET['clube_id'];

// PASSO 1: só o SQL mudou (agora traz mais colunas)
$stmt = $pdo->prepare("
    SELECT jogadores.id, jogadores.nome, jogadores.apelido, jogadores.nascimento,
           jogadores.foto, jogadores.camisa, jogadores.tipo_contrato,
           jogadores.inicio_contrato, jogadores.inscricao, jogadores.ativo,
           clubes.id AS clube_id, clubes.nome AS clube_nome, clubes.divisao
    FROM jogadores
    JOIN clubes ON jogadores.clube_id = clubes.id
    WHERE jogadores.clube_id = :clube_id
");
$stmt->execute([':clube_id' => $clubeId]);

// PASSO 2: o fetchAll agora vai para $linhas, e montamos $jogadores
$linhas = $stmt->fetchAll(PDO::FETCH_ASSOC);
$jogadores = [];

foreach ($linhas as $l) {
    $jogadores[] = [
        "id" => (int)$l["id"],
        "nome" => $l["nome"],
        "apelido" => $l["apelido"],
        "nascimento" => $l["nascimento"],
        "foto" => $l["foto"],
        "ativo" => (bool)$l["ativo"],
        "contrato" => [
            "numero" => $l["camisa"],
            "tipo" => $l["tipo_contrato"],        // sua lacuna
            "inicio" => $l["inicio_contrato"],      // sua lacuna
            "inscricao" => $l["inscricao"]    // sua lacuna
        ],
        "clube" => [
            "id" => (int)$l["clube_id"],
            "name" => $l["clube_nome"],        // sua lacuna
            "division" => $l["divisao"]     // sua lacuna
        ]
    ];
}

echo json_encode($jogadores);