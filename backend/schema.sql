CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type ENUM('income', 'expense') NOT NULL DEFAULT 'expense',
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: a couple of sample rows so the chart has something to show on first load
INSERT INTO expenses (title, amount, category, type, expense_date) VALUES
('Salary', 25000.00, 'Income', 'income', CURDATE()),
('Groceries', 1500.00, 'Food', 'expense', CURDATE()),
('Bus Pass', 500.00, 'Transport', 'expense', CURDATE());
