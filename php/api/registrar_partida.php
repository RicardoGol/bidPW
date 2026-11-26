<?php
header('Content-Type: application/json');
require 'conexao.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['data'], $dados['mandante_id'], $dados['visitante_id'], $dados['jogadores'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO partidas (data, mandante_id, visitante_id)
                           VALUES (:data, :mandante, :visitante)");
    $stmt->execute([
        ':data'      => $dados['data'],
        ':mandante'  => $dados['mandante_id'],
        ':visitante' => $dados['visitante_id']                    // lacuna 1
    ]);

    $partidaId = $pdo->lastInsertId();         // o id que o banco acabou de gerar

    $stmtJ = $pdo->prepare("INSERT INTO partida_jogadores
        (partida_id, jogador_id, titular, gols, assistencias,
         cartao_amarelo, cartao_vermelho, substituicao)
        VALUES (:partida, :jogador, :titular, :gols, :assist,
                :amarelo, :vermelho, :subst)");

    foreach ($dados['jogadores'] as $j) {
        $stmtJ->execute([
            ':partida'  => $partidaId,
            ':jogador'  => $j['id'],
            ':titular'  => $j['titular'] ? 1 : 0,
            ':gols'     => $j['gols'],
            ':assist'   => $j['assistencias'],                // lacuna 2
            ':amarelo'  => $j['cartaoAmarelo'] ? 1 : 0,
            ':vermelho' => $j['cartao_vermelho'] ? 1 : 0,                // lacuna 3
            ':subst'    => $j['substituicao']
        ]);
    }

    $pdo->commit();
    echo json_encode(["sucesso" => true]);
}catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(["erro" => "não foi possível registrar a partida"]);
}