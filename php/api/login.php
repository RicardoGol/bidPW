<?php

header('Content-Type: application/json');
$dados = json_decode(file_get_contents('php://input'), true);
$manter = !empty($dados['manter']);
session_set_cookie_params(['lifetime' => $manter ? 60*60*24*30 : 0]);
session_start();



// 1. validar com isset: usuario e senha
if (!isset($dados['usuario'], $dados['senha'])) {
    echo json_encode(["erro" => "faltam parâmetros"]);
    exit;
}
// 2. comparar com o valor guardado NO PHP
$usuarioCerto = 'admin';
$senhaCerta = '0000';
// 3. se certo: $_SESSION['autenticado'] = true; responder {"sucesso": true}
// 4. se errado: responder {"erro": "Login inválido"}
if ($dados['usuario'] === $usuarioCerto && $dados['senha'] === $senhaCerta) {
    $_SESSION['autenticado'] = true;
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["erro" => "Login inválido"]);
}