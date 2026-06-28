<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id']) || empty($data['title']) || empty($data['amount']) || empty($data['category']) || empty($data['type']) || empty($data['expense_date'])) {
    http_response_code(400);
    echo json_encode(["error" => "All fields including id are required."]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "UPDATE expenses SET title = :title, amount = :amount, category = :category, type = :type, expense_date = :expense_date WHERE id = :id"
    );
    $stmt->execute([
        ':title' => $data['title'],
        ':amount' => $data['amount'],
        ':category' => $data['category'],
        ':type' => $data['type'],
        ':expense_date' => $data['expense_date'],
        ':id' => $data['id'],
    ]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
