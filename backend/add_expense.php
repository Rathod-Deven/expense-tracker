<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

// Basic validation — never trust client input
if (empty($data['title']) || empty($data['amount']) || empty($data['category']) || empty($data['type']) || empty($data['expense_date'])) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required."]);
    exit;
}

if (!in_array($data['type'], ['income', 'expense'])) {
    http_response_code(400);
    echo json_encode(["error" => "Type must be 'income' or 'expense'."]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO expenses (title, amount, category, type, expense_date) VALUES (:title, :amount, :category, :type, :expense_date)"
    );
    $stmt->execute([
        ':title' => $data['title'],
        ':amount' => $data['amount'],
        ':category' => $data['category'],
        ':type' => $data['type'],
        ':expense_date' => $data['expense_date'],
    ]);

    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
