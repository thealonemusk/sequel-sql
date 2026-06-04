export const initialSchema = `
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    transaction_date DATE,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    login_time DATETIME,
    ip_address TEXT,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
);
`;

export const seedData = `
INSERT INTO employees (name, department, role) VALUES 
('Alice Smith', 'Engineering', 'Software Engineer'),
('Bob Jones', 'Marketing', 'Marketing Manager'),
('Charlie Brown', 'Finance', 'Financial Analyst'),
('Diana Prince', 'Executive', 'CEO'),
('Eve Davis', 'Finance', 'Senior Accountant'),
('Frank Castle', 'Security', 'Head of Security');

INSERT INTO transactions (employee_id, amount, description, transaction_date) VALUES 
(1, 150.00, 'Office Supplies', '2023-10-01'),
(2, 1200.50, 'Ad Campaign', '2023-10-02'),
(3, 50.00, 'Coffee', '2023-10-03'),
(5, 45000.00, 'Consulting Fee - Offshore', '2023-10-04'),
(5, 50000.00, 'Vendor Payment - LLC', '2023-10-05'),
(4, 500.00, 'Client Dinner', '2023-10-06');

INSERT INTO access_logs (employee_id, login_time, ip_address) VALUES 
(1, '2023-10-01 08:30:00', '192.168.1.5'),
(2, '2023-10-01 09:15:00', '192.168.1.12'),
(5, '2023-10-04 23:45:00', '10.0.0.45'),
(5, '2023-10-05 02:15:00', '10.0.0.45'),
(3, '2023-10-05 08:50:00', '192.168.1.18'),
(4, '2023-10-06 10:00:00', '192.168.1.2');
`;
