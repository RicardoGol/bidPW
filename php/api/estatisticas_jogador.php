<?php
header('Content-Type: application/json');
require 'conexao.php';

if (!isset($_GET['id'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT COUNT(*) AS partidas,
           COALESCE(SUM(gols), 0) AS gols,
           COALESCE(SUM(assistencias), 0) AS assistencias,
           COALESCE(SUM(cartao_amarelo), 0) AS amarelos,
           COALESCE(SUM(cartao_vermelho), 0) AS vermelhos,
           COALESCE(SUM(substituicao IS NOT NULL), 0) AS substituicoes
    FROM partida_jogadores
    WHERE jogador_id = :id
");
$stmt->execute([':id' => $_GET['id']]);         // lacuna 1
$stats = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($stats);                   // lacuna 2