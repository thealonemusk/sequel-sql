export const initialSchema = `
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    salary INTEGER DEFAULT 60000,
    manager_id INTEGER,
    hire_date DATE DEFAULT '2022-01-15'
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
    status TEXT DEFAULT 'Success',
    FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    budget DECIMAL(12, 2) NOT NULL,
    office_location TEXT NOT NULL
);

CREATE TABLE offshore_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_number TEXT NOT NULL UNIQUE,
    bank_name TEXT NOT NULL,
    country TEXT NOT NULL,
    status TEXT DEFAULT 'Active'
);

CREATE TABLE transfer_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER,
    offshore_account_id INTEGER,
    transfer_status TEXT NOT NULL,
    routed_through_country TEXT,
    FOREIGN KEY(transaction_id) REFERENCES transactions(id),
    FOREIGN KEY(offshore_account_id) REFERENCES offshore_accounts(id)
);

CREATE TABLE blacklisted_ips (
    ip_address TEXT PRIMARY KEY,
    risk_level TEXT NOT NULL,
    reason TEXT NOT NULL,
    detected_at DATETIME
);
`;

export const seedData = `
INSERT INTO departments (name, budget, office_location) VALUES
('Engineering', 500000.00, 'Building A, Floor 3'),
('Marketing', 150000.00, 'Building B, Floor 1'),
('Finance', 300000.00, 'Building A, Floor 4'),
('Executive', 1000000.00, 'Building A, Floor 5'),
('Security', 250000.00, 'Building C, Floor 1');

INSERT INTO employees (name, department, role, salary, manager_id, hire_date) VALUES 
('Alice Smith', 'Engineering', 'Software Engineer', 85000, 4, '2022-03-15'),
('Bob Jones', 'Marketing', 'Marketing Manager', 72000, 4, '2021-08-10'),
('Charlie Brown', 'Finance', 'Financial Analyst', 68000, 5, '2023-01-20'),
('Diana Prince', 'Executive', 'CEO', 240000, NULL, '2020-05-01'),
('Eve Davis', 'Finance', 'Senior Accountant', 98000, 4, '2021-11-15'),
('Frank Castle', 'Security', 'Head of Security', 85000, 4, '2022-09-01');

INSERT INTO transactions (employee_id, amount, description, transaction_date) VALUES 
(1, 150.00, 'Office Supplies', '2023-10-01'),
(2, 1200.50, 'Ad Campaign', '2023-10-02'),
(3, 50.00, 'Coffee', '2023-10-03'),
(5, 45000.00, 'Consulting Fee - Offshore', '2023-10-04'),
(5, 50000.00, 'Vendor Payment - LLC', '2023-10-05'),
(4, 500.00, 'Client Dinner', '2023-10-06'),
(1, 350.00, 'Cloud Server Hosting', '2023-10-07'),
(2, 4500.00, 'Event Sponsorship', '2023-10-08'),
(3, 120.00, 'Printer Ink', '2023-10-09'),
(5, 9500.00, 'Software Licenses', '2023-10-10'),
(6, 1500.00, 'Security Camera Upgrade', '2023-10-11');

INSERT INTO access_logs (employee_id, login_time, ip_address, status) VALUES 
(1, '2023-10-01 08:30:00', '192.168.1.5', 'Success'),
(2, '2023-10-01 09:15:00', '192.168.1.12', 'Success'),
(5, '2023-10-04 23:45:00', '10.0.0.45', 'Success'),
(5, '2023-10-05 02:15:00', '10.0.0.45', 'Success'),
(3, '2023-10-05 08:50:00', '192.168.1.18', 'Success'),
(4, '2023-10-06 10:00:00', '192.168.1.2', 'Success'),
(5, '2023-10-06 03:00:00', '198.51.100.72', 'Failed'),
(5, '2023-10-06 03:05:00', '198.51.100.72', 'Failed'),
(6, '2023-10-07 07:00:00', '192.168.1.30', 'Success'),
(1, '2023-10-07 22:15:00', '192.168.1.5', 'Success');

INSERT INTO offshore_accounts (account_number, bank_name, country, status) VALUES
('KY-8829-X', 'Grand Cayman Trust', 'Cayman Islands', 'Active'),
('CH-0912-P', 'Zurich Private Bank', 'Switzerland', 'Active'),
('PA-7312-L', 'Panama Secure Holdings', 'Panama', 'Suspended');

INSERT INTO transfer_logs (transaction_id, offshore_account_id, transfer_status, routed_through_country) VALUES
(4, 1, 'Completed', 'Bahamas'),
(5, 2, 'Completed', 'Luxembourg');

INSERT INTO blacklisted_ips (ip_address, risk_level, reason, detected_at) VALUES
('198.51.100.72', 'High', 'Brute force attempts', '2023-10-06 04:00:00'),
('203.0.113.15', 'Medium', 'Port scanning logs', '2023-10-05 12:30:00');
`;
