<?php
header('Content-Type: application/json');
require 'conexao.php';

if (!isset($_GET['id'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}
$jogadorId = $_GET['id'];

$stmt = $pdo->prepare("
    SELECT jogadores.id, jogadores.nome, jogadores.apelido, jogadores.camisa,
           clubes.nome AS clube, clubes.divisao
    FROM jogadores
    JOIN clubes ON jogadores.clube_id = clubes.id
    WHERE jogadores.id = :id
");
$stmt->execute([':id' => $jogadorId]);          // lacuna 1
$jogador = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$jogador) {
    echo json_encode(["erro" => "jogador não encontrado"]);
    exit;
}

echo json_encode($jogador);          // lacuna 2