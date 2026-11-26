<?php
header('Content-Type: application/json');
require 'conexao.php';

$dados = json_decode(file_get_contents('php://input'), true);

// PASSO 1: validar os campos obrigatórios
if (!isset($dados['nome'], $dados['nascimento'], $dados['camisa'],
           $dados['publicacao'], $dados['inicio'], $dados['inscricao'],
           $dados['clube_id'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}

// PASSO 2: o INSERT com espaços reservados
$stmt = $pdo->prepare("
    INSERT INTO jogadores
        (nome, apelido, nascimento, foto, camisa, tipo_contrato,
         data_publicacao, inicio_contrato, inscricao, clube_id)
    VALUES
        (:nome, :apelido, :nascimento, :foto, :camisa, :tipo,
         :publicacao, :inicio, :inscricao, :clube_id)
");

// PASSO 3: preencher cada espaço
try {
    $stmt->execute([
    ':nome'       => $dados['nome'],
    ':apelido'    => $dados['apelido'] ?? null,
    ':nascimento' => $dados['nascimento'],   // lacuna
    ':foto'       => $dados['foto'] ?? null,
    ':camisa'     => $dados['camisa'] ,  // lacuna
    ':tipo'       => $dados['tipo'] ?? 'definitivo',
    ':publicacao' => $dados['publicacao'],   // lacuna
    ':inicio'     => $dados['inicio'],   // lacuna
    ':inscricao'  => $dados['inscricao'],   // lacuna
    ':clube_id'   => $dados['clube_id']    // lacuna
    ]);
    echo json_encode(["sucesso" => true]);
} catch (PDOException $e) {
     $codigo = $e->errorInfo[1];

    if($codigo == 1062){
        echo json_encode(["erro" => "Inscrição repetida"]);
        exit;
    }
    if($codigo == 1452){
        echo json_encode(["erro" => "Clube inexistente"]);
        exit;
    }
    echo json_encode(["erro" => "não foi possível registrar"]);
}