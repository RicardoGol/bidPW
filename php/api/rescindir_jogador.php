<?php
header('Content-Type: application/json');
require 'conexao.php';

$dados = json_decode(file_get_contents('php://input'), true);
if (!isset($dados['id'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE jogadores SET tipo_contrato = 'rescisao' WHERE id = :id");

try{
    $stmt-> execute([
        ':id' => $dados['id']
    ]);
if ($stmt->rowCount() == 0) {
    echo json_encode(["erro" => "Jogador inexistente ou já rescindido"]);
} else {
    echo json_encode(["sucesso" => true]);
}
}
catch (PDOException $e) {
    echo json_encode(["erro" => "não foi possível rescindir"]);
}
