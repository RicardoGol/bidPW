<?php
header('Content-Type: application/json');
require 'conexao.php';          // traz a linha telefônica para este arquivo
if (!isset($_GET['estado'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}
$estado = $_GET['estado'];

$stmt = $pdo->prepare("SELECT id, nome AS name, divisao AS division FROM clubes WHERE estado = :estado");
$stmt->execute([':estado' => $estado]);     // lacuna 1
$clubes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($clubes);                  // lacuna 2