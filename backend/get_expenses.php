<?php
require 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM expenses ORDER BY expense_date DESC, id DESC");
    $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($expenses);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
