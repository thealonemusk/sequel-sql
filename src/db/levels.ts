export interface QueryResult {
    columns: string[];
    values: any[][];
}

export interface Level {
    id: number;
    title: string;
    story: string;
    task: string;
    answer: string; // sample correct SQL answer shown on hint
    validator: (results: QueryResult[], query: string) => { success: boolean; message: string };
    sampleOutput?: {
        columns: string[];
        values: any[][];
    };
}

export const levels: Level[] = [
    {
        id: 1,
        title: "Level 1: The First Day",
        story: "Welcome to OmniCorp, Data Analyst. It's your first day on the job, but things are already chaotic. Rumor has it that a large sum of money has gone missing. Before we panic, let's just get familiar with our team.",
        task: "Retrieve all columns and records from the 'employees' table.",
        answer: "SELECT * FROM employees;",
        sampleOutput: {
            columns: ["id", "name", "department", "role", "salary", "manager_id", "hire_date"],
            values: [
                [1, "Alice Smith", "Engineering", "Software Engineer", 85000, 4, "2022-03-15"]
            ]
        },
        validator: (results, _query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const hasAllColumns =
                res.columns.includes('id') &&
                res.columns.includes('name') &&
                res.columns.includes('department');
            if (hasAllColumns && res.values.length >= 6) {
                return { success: true, message: "Great job! You found the employee directory." };
            }
            return { success: false, message: "Make sure you SELECT * FROM employees to retrieve all records." };
        }
    },
    {
        id: 2,
        title: "Level 2: Midnight Oil",
        story: "Security noticed some unusual activity in the system logs. Someone was logged into the internal servers very late at night. We need to find out who it was.",
        task: "Find all logins in the 'access_logs' table that occurred after 10:00 PM (22:00:00) on any date.",
        answer: "SELECT * FROM access_logs WHERE TIME(login_time) > '22:00:00';",
        sampleOutput: {
            columns: ["id", "employee_id", "login_time", "ip_address", "status"],
            values: [
                [3, 5, "2023-10-04 23:45:00", "10.0.0.45", "Success"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('where')) {
                return { success: false, message: "You need to use a WHERE clause to filter the results." };
            }
            // TIME(login_time) > '22:00:00' returns 2 rows:
            // id=3: Eve at 23:45 (10.0.0.45), id=10: Alice at 22:15 (192.168.1.5)
            // Rows between 00:00 and 06:00 (02:15, 03:00, 03:05) also qualify if using strftime or substring
            if (res.values.length >= 2 && (
                res.values.some(row => String(row[3]).includes('10.0.0.45')) ||
                res.values.some(row => String(row[2]).includes('22:'))
            )) {
                return { success: true, message: "Excellent! You found the suspicious late-night logins." };
            }
            return { success: false, message: "Filter logins where the time is after 22:00:00. Try: WHERE TIME(login_time) > '22:00:00'" };
        }
    },
    {
        id: 3,
        title: "Level 3: Follow the Money",
        story: "Those late-night logins coincide with some massive outgoing transactions. Let's see how much money has been moving around.",
        task: "Calculate the total sum of all amounts in the 'transactions' table.",
        answer: "SELECT SUM(amount) FROM transactions;",
        sampleOutput: {
            columns: ["SUM(amount)"],
            values: [
                [112870.50]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('sum')) {
                return { success: false, message: "You need to use the SUM() function." };
            }
            const res = results[0];
            // Actual total: 150+1200.5+50+45000+50000+500+350+4500+120+9500+1500 = 112870.5
            if (res.values.length > 0 && Number(res.values[0][0]) > 100000) {
                return { success: true, message: "Wow, over 112k in total transactions!" };
            }
            return { success: false, message: "Make sure you are querying SUM(amount) FROM transactions." };
        }
    },
    {
        id: 4,
        title: "Level 4: Connecting the Dots",
        story: "We need names, not just IDs. Let's join the tables to see exactly who made these transactions.",
        task: "Retrieve the names of employees and their transaction amounts by joining the 'employees' and 'transactions' tables.",
        answer: "SELECT employees.name, transactions.amount FROM employees JOIN transactions ON employees.id = transactions.employee_id;",
        sampleOutput: {
            columns: ["name", "amount"],
            values: [
                ["Alice Smith", 150.00]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "You need to use a JOIN." };
            }
            const res = results[0];
            if (res.columns.includes('name') && res.columns.includes('amount') && res.values.length >= 6) {
                return { success: true, message: "Perfect join! Now we have names." };
            }
            return { success: false, message: "Make sure you SELECT name and amount from the joined tables." };
        }
    },
    {
        id: 5,
        title: "Level 5: The Suspect",
        story: "Let's find the biggest spender. We want to find employees whose transactions were greater than 10,000.",
        task: "Retrieve the names of employees and their transaction amounts for transactions that were strictly greater than 10,000.",
        answer: "SELECT employees.name, transactions.amount FROM employees JOIN transactions ON employees.id = transactions.employee_id WHERE transactions.amount > 10000;",
        sampleOutput: {
            columns: ["name", "amount"],
            values: [
                ["Eve Davis", 45000.00]
            ]
        },
        validator: (results, _query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            // Eve has 2 transactions > 10k: 45000 and 50000
            if (res.values.length === 2 && res.values.every(row => row.includes('Eve Davis'))) {
                return { success: true, message: "Eve Davis! She is the one making those massive payments." };
            }
            return { success: false, message: "You should find exactly 2 transactions over 10,000 — both belonging to Eve Davis." };
        }
    },
    {
        id: 6,
        title: "Level 6: Case Closed",
        story: "We have our suspect! Eve Davis from Finance has been wiring money to offshore LLCs in the middle of the night. Let's secure her account.",
        task: "Suspend 'Eve Davis' by updating her role in the 'employees' table to 'Suspended'.",
        answer: "UPDATE employees SET role = 'Suspended' WHERE name = 'Eve Davis';",
        sampleOutput: {
            columns: [],
            values: []
        },
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (
                lowerQuery.includes('update employees') &&
                lowerQuery.includes('set role') &&
                lowerQuery.includes('suspended') &&
                lowerQuery.includes('eve davis')
            ) {
                return { success: true, message: "Account suspended! You saved OmniCorp." };
            }
            return { success: false, message: "Make sure you UPDATE employees SET role = 'Suspended' WHERE name = 'Eve Davis';" };
        }
    },
    {
        id: 7,
        title: "Level 7: Access Mapping",
        story: "Although Eve is suspended, we need to gather statistics on access logs to identify other potentially compromised machines. Let's inspect login frequencies by IP.",
        task: "Count the number of logins from each IP address in the 'access_logs' table, grouped by IP address.",
        answer: "SELECT ip_address, COUNT(*) FROM access_logs GROUP BY ip_address;",
        sampleOutput: {
            columns: ["ip_address", "COUNT(*)"],
            values: [
                ["192.168.1.5", 2]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('group by') || !lowerQuery.includes('count')) {
                return { success: false, message: "You need to use GROUP BY and COUNT()." };
            }
            // There are distinct IPs in access_logs: 192.168.1.5, 192.168.1.12, 10.0.0.45, 192.168.1.18, 192.168.1.2, 198.51.100.72, 192.168.1.30 = 7 IPs
            if (res.values.length >= 5) {
                return { success: true, message: "Excellent! You successfully mapped access volume to IP addresses." };
            }
            return { success: false, message: "Make sure you SELECT ip_address and COUNT(*) grouped by ip_address." };
        }
    },
    {
        id: 8,
        title: "Level 8: Expense Auditing",
        story: "Let's perform a department-wide expenditure check. We need to identify total expenses for each department, helping security locate where corporate funds are leaking.",
        task: "Calculate the total transaction amount for each department by combining the employee and transaction records.",
        answer: "SELECT employees.department, SUM(transactions.amount) FROM employees JOIN transactions ON employees.id = transactions.employee_id GROUP BY employees.department;",
        sampleOutput: {
            columns: ["department", "SUM(amount)"],
            values: [
                ["Finance", 104500.00]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join') || !lowerQuery.includes('group by') || !lowerQuery.includes('sum')) {
                return { success: false, message: "Make sure to JOIN the tables, GROUP BY department, and calculate SUM(amount)." };
            }
            // Finance: Eve(45000+50000+9500=104500), Charlie(50+120=170) = 104670? 
            // Let's check: Charlie(3)=50+120=170, Eve(5)=45000+50000+9500=104500, Finance total=104670
            const financeRow = res.values.find(row => row.some(val => String(val) === 'Finance'));
            if (financeRow && Number(financeRow[1]) > 100000) {
                return { success: true, message: "Spot on! The Finance department is indeed the source of major capital outflows." };
            }
            return { success: false, message: "Double check your SUM and JOIN logic. Finance should show the largest total." };
        }
    },
    {
        id: 9,
        title: "Level 9: Quiet Accounts",
        story: "Some employees might have been dormant. Let's find employees who have never made a single corporate transaction, as their credentials might have been stolen to bypass transaction limits.",
        task: "Find the names of employees who have never made any transactions.",
        answer: "SELECT employees.name FROM employees LEFT JOIN transactions ON employees.id = transactions.employee_id WHERE transactions.employee_id IS NULL;",
        sampleOutput: {
            columns: ["name"],
            values: []
        },
        validator: (results, query) => {
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('left join') && !lowerQuery.includes('not in') && !lowerQuery.includes('not exists')) {
                return { success: false, message: "Use a LEFT JOIN with IS NULL, or NOT IN / NOT EXISTS to find employees without transactions." };
            }
            // All 6 employees have transactions — so the correct answer returns 0 rows.
            // sql.js returns [] (empty array) for queries with no matching rows.
            if (results.length === 0 || (results.length > 0 && results[0].values.length === 0)) {
                return { success: true, message: "Correct! Every employee has at least one transaction on record — no dormant accounts found." };
            }
            return { success: false, message: "Every employee in this dataset has at least one transaction. Your query should return 0 rows." };
        }
    },
    {
        id: 10,
        title: "Level 10: Suspicious Subnet Access",
        story: "Security reports that all unauthorized server logins came from the local IP subnet '10.0.0.x'. Let's identify the names of all employees who have logged in from these IP addresses.",
        task: "Find the unique (distinct) names of employees who have logged in from an IP address in the '10.0.0.x' subnet.",
        answer: "SELECT DISTINCT employees.name FROM employees JOIN access_logs ON employees.id = access_logs.employee_id WHERE access_logs.ip_address LIKE '10.0.0%';",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Eve Davis"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "You need to JOIN employees and access_logs." };
            }
            if (!lowerQuery.includes('like')) {
                return { success: false, message: "Use LIKE with '10.0.0%' to match the IP pattern." };
            }
            // Only Eve (employee_id=5) has logins from 10.0.0.45
            if (res.values.length === 1 && res.values[0].includes('Eve Davis')) {
                return { success: true, message: "Excellent! Eve Davis is the only employee who logged in from the suspicious subnet." };
            }
            return { success: false, message: "Your query should return exactly one name: Eve Davis." };
        }
    },
    {
        id: 11,
        title: "Level 11: Call in the Experts",
        story: "OmniCorp CEO Diana Prince has requested additional external help. We are onboarding a legendary cyber investigator, Sherlock Holmes, to audit our networks.",
        task: "Onboard our new lead investigator by inserting a record for 'Sherlock Holmes' in the 'Security' department with the role 'Lead Investigator' into the 'employees' table.",
        answer: "INSERT INTO employees (name, department, role) VALUES ('Sherlock Holmes', 'Security', 'Lead Investigator');",
        sampleOutput: {
            columns: [],
            values: []
        },
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (
                lowerQuery.includes('insert into employees') &&
                lowerQuery.includes('sherlock holmes') &&
                lowerQuery.includes('security') &&
                lowerQuery.includes('lead investigator')
            ) {
                return { success: true, message: "Welcome to the team, detective Sherlock Holmes! Investigator record successfully created." };
            }
            return { success: false, message: "Check your syntax: INSERT INTO employees (name, department, role) VALUES ('Sherlock Holmes', 'Security', 'Lead Investigator');" };
        }
    },
    {
        id: 12,
        title: "Level 12: Wire Transfers Audit",
        story: "Sherlock suspects the money was laundered using offshore shell companies. Let's isolate all transaction descriptions that mention 'Offshore' or 'LLC'.",
        task: "Retrieve all transactions where the transaction description contains either 'Offshore' or 'LLC'.",
        answer: "SELECT * FROM transactions WHERE description LIKE '%Offshore%' OR description LIKE '%LLC%';",
        sampleOutput: {
            columns: ["id", "employee_id", "amount", "description", "transaction_date"],
            values: [
                [4, 5, 45000.00, "Consulting Fee - Offshore", "2023-10-04"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('like')) {
                return { success: false, message: "Make sure you use LIKE to check for pattern matches in descriptions." };
            }
            // "Consulting Fee - Offshore" and "Vendor Payment - LLC"
            if (
                res.values.length === 2 &&
                res.values.some(row => row.some(val => String(val).includes('Offshore'))) &&
                res.values.some(row => row.some(val => String(val).includes('LLC')))
            ) {
                return { success: true, message: "Incredible! You isolated the two offshore LLC transactions." };
            }
            return { success: false, message: "Your query should find exactly 2 suspicious transactions: one with 'Offshore' and one with 'LLC'." };
        }
    },
    {
        id: 13,
        title: "Level 13: Large Average Spenders",
        story: "Let's group transactions by employee, and compute their averages. We want to find employees whose average transaction amount is strictly greater than 1000.",
        task: "Find the employee IDs whose average transaction amount is strictly greater than 1,000, along with their average transaction amount.",
        answer: "SELECT employee_id, AVG(amount) FROM transactions GROUP BY employee_id HAVING AVG(amount) > 1000;",
        sampleOutput: {
            columns: ["employee_id", "AVG(amount)"],
            values: [
                [2, 2850.25]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('group by') || !lowerQuery.includes('having') || !lowerQuery.includes('avg')) {
                return { success: false, message: "You need to use GROUP BY, HAVING, and AVG()." };
            }
            // employee 2 (Bob): 1200.50 + 4500 = 5700.50 / 2 = 2850.25 > 1000 ✓
            // employee 4 (Diana): 500 / 1 = 500 < 1000 ✗
            // employee 5 (Eve): 45000+50000+9500 = 104500 / 3 = 34833 > 1000 ✓
            // employee 6 (Frank): 1500 / 1 = 1500 > 1000 ✓
            // employee 1 (Alice): 150+350 = 500 / 2 = 250 < 1000 ✗
            // employee 3 (Charlie): 50+120 = 170 / 2 = 85 < 1000 ✗
            // So: employee_ids 2, 5, 6 qualify
            if (res.values.length === 3 &&
                res.values.some(row => Number(row[0]) === 2) &&
                res.values.some(row => Number(row[0]) === 5) &&
                res.values.some(row => Number(row[0]) === 6)) {
                return { success: true, message: "Fantastic! You highlighted employees with large average transaction sizes." };
            }
            return { success: false, message: "Check your logic. You should see employee_ids 2, 5, and 6." };
        }
    },
    {
        id: 14,
        title: "Level 14: Finance Ledger Audit",
        story: "Let's audit all transactions associated with employees working in the 'Finance' department to check if anyone else was collaborating with Eve.",
        task: "Audit all transactions for employees in the 'Finance' department. Select the employee's name, transaction description, amount, and transaction date.",
        answer: "SELECT employees.name, transactions.description, transactions.amount, transactions.transaction_date FROM employees JOIN transactions ON employees.id = transactions.employee_id WHERE employees.department = 'Finance';",
        sampleOutput: {
            columns: ["name", "description", "amount", "transaction_date"],
            values: [
                ["Charlie Brown", "Coffee", 50.00, "2023-10-03"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join') || !lowerQuery.includes('where') || !lowerQuery.includes('finance')) {
                return { success: false, message: "Make sure you JOIN the tables and filter WHERE department = 'Finance'." };
            }
            // Charlie: 2 transactions (50, 120), Eve: 3 transactions (45000, 50000, 9500) = 5 rows total
            if (
                res.values.length === 5 &&
                res.values.some(row => row.includes('Charlie Brown')) &&
                res.values.some(row => row.includes('Eve Davis'))
            ) {
                return { success: true, message: "Audit complete! All 5 transactions for Finance employees are listed." };
            }
            return { success: false, message: "Verify your query. There should be 5 rows returned for employees in Finance (Charlie Brown and Eve Davis)." };
        }
    },
    {
        id: 15,
        title: "Level 15: Clean Evidence Logs",
        story: "Eve Davis's logs have been secured and duplicated for the legal trial. Security policies dictate we must now purge her internal access logs from the live database to clean up workspace nodes.",
        task: "Purge the access logs for employee ID 5 from the live database by deleting their records from 'access_logs'.",
        answer: "DELETE FROM access_logs WHERE employee_id = 5;",
        sampleOutput: {
            columns: [],
            values: []
        },
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (
                lowerQuery.includes('delete') &&
                lowerQuery.includes('access_logs') &&
                (lowerQuery.includes('employee_id') || lowerQuery.includes('employee_id')) &&
                lowerQuery.includes('5')
            ) {
                return { success: true, message: "Evidence secured! The database has been purged and access logs are clean." };
            }
            return { success: false, message: "Use query: DELETE FROM access_logs WHERE employee_id = 5;" };
        }
    },
    {
        id: 16,
        title: "Level 16: High Earners Audit",
        story: "Corporate payroll wants to make sure all administrative high earners are accounted for during the heist audits.",
        task: "Retrieve all employee records from the 'employees' table where the salary is strictly greater than 80,000.",
        answer: "SELECT * FROM employees WHERE salary > 80000;",
        sampleOutput: {
            columns: ["id", "name", "department", "role", "salary", "manager_id", "hire_date"],
            values: [
                [1, "Alice Smith", "Engineering", "Software Engineer", 85000, 4, "2022-03-15"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('where') || !lowerQuery.includes('salary')) {
                return { success: false, message: "Make sure to use a WHERE filter on salary." };
            }
            // Salaries > 80000: Alice(85k), Eve(98k), Diana(240k), Frank(85k) = 4 rows
            if (
                res.values.length === 4 &&
                res.values.some(row => row.includes('Alice Smith')) &&
                res.values.some(row => row.includes('Diana Prince')) &&
                res.values.some(row => row.includes('Eve Davis')) &&
                res.values.some(row => row.includes('Frank Castle'))
            ) {
                return { success: true, message: "High earners isolated successfully!" };
            }
            return { success: false, message: "Check your logic. Employees with salary > 80000 are: Alice Smith, Eve Davis, Frank Castle, and Diana Prince." };
        }
    },
    {
        id: 17,
        title: "Level 17: Date-Bound Auditing",
        story: "The major financial discrepancies occurred within a critical 3-day window in October.",
        task: "Retrieve all transactions that occurred between October 4th, 2023, and October 6th, 2023, inclusive.",
        answer: "SELECT * FROM transactions WHERE transaction_date BETWEEN '2023-10-04' AND '2023-10-06';",
        sampleOutput: {
            columns: ["id", "employee_id", "amount", "description", "transaction_date"],
            values: [
                [4, 5, 45000.00, "Consulting Fee - Offshore", "2023-10-04"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('between') && (!lowerQuery.includes('>=') || !lowerQuery.includes('<='))) {
                return { success: false, message: "Use BETWEEN or comparable operators (>= and <=) for dates." };
            }
            // Oct 4: 45000(Eve), Oct 5: 50000(Eve), Oct 6: 500(Diana) = 3 rows
            if (res.values.length === 3 && res.values.some(row => row.includes('Consulting Fee - Offshore'))) {
                return { success: true, message: "Discrepancy timeframe transactions isolated." };
            }
            return { success: false, message: "You should find exactly 3 transactions in this date range (Oct 4–6, 2023)." };
        }
    },
    {
        id: 18,
        title: "Level 18: Ledger Size",
        story: "Let's count the total size of the transaction log. We need to verify if any rows were deleted.",
        task: "Count the total number of transaction records on the ledger.",
        answer: "SELECT COUNT(*) FROM transactions;",
        sampleOutput: {
            columns: ["COUNT(*)"],
            values: [
                [11]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('count')) {
                return { success: false, message: "You must use the COUNT() function." };
            }
            // The seed data inserts 11 transactions
            if (Number(res.values[0][0]) === 11) {
                return { success: true, message: "Ledger count verified. All 11 records are intact." };
            }
            return { success: false, message: "Check your query. Make sure it selects COUNT(*) FROM transactions." };
        }
    },
    {
        id: 19,
        title: "Level 19: Unique Roles",
        story: "To understand credentials and access hierarchies, let's list all unique roles within the firm.",
        task: "Retrieve the list of unique roles held by employees in the company.",
        answer: "SELECT DISTINCT role FROM employees;",
        sampleOutput: {
            columns: ["role"],
            values: [
                ["Software Engineer"],
                ["Marketing Manager"],
                ["Financial Analyst"],
                ["CEO"],
                ["Senior Accountant"],
                ["Head of Security"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('distinct')) {
                return { success: false, message: "You must use the DISTINCT keyword." };
            }
            // 6 unique roles in seed data
            if (res.values.length >= 5) {
                return { success: true, message: "Unique roles extracted successfully!" };
            }
            return { success: false, message: "Double check your DISTINCT role selection." };
        }
    },
    {
        id: 20,
        title: "Level 20: Top Spenders",
        story: "We need to find the three absolute largest transactions on the ledger to present to executive management.",
        task: "Find the three largest transactions on the ledger, ordered from highest amount to lowest.",
        answer: "SELECT * FROM transactions ORDER BY amount DESC LIMIT 3;",
        sampleOutput: {
            columns: ["id", "employee_id", "amount", "description", "transaction_date"],
            values: [
                [5, 5, 50000.00, "Vendor Payment - LLC", "2023-10-05"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('order by') || !lowerQuery.includes('desc') || !lowerQuery.includes('limit')) {
                return { success: false, message: "Make sure you ORDER BY amount DESC and LIMIT 3." };
            }
            // Top 3: 50000(Eve), 45000(Eve), 9500(Eve)
            if (res.values.length === 3 && Number(res.values[0][2]) === 50000) {
                return { success: true, message: "Top 3 transactions identified. High value targets confirmed." };
            }
            return { success: false, message: "Check your sorting and limit syntax. The largest transaction is 50,000." };
        }
    },
    {
        id: 21,
        title: "Level 21: Department Budget Check",
        story: "Let's cross reference our staff with the departments table to inspect department budgets.",
        task: "Retrieve each employee's name along with their department's budget.",
        answer: "SELECT employees.name, departments.budget FROM employees JOIN departments ON employees.department = departments.name;",
        sampleOutput: {
            columns: ["name", "budget"],
            values: [
                ["Alice Smith", 500000]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "You must perform a JOIN." };
            }
            if (res.columns.includes('name') && res.columns.includes('budget') && res.values.length >= 6) {
                return { success: true, message: "Staff-to-budget mapping completed successfully!" };
            }
            return { success: false, message: "Make sure you SELECT name and budget from the joined tables." };
        }
    },
    {
        id: 22,
        title: "Level 22: Building A Operations",
        story: "Security reports suggest the compromised servers were located in Building A. Let's look up departments housed there with substantial budgets.",
        task: "Identify departments housed in Building A that have budgets strictly greater than 200,000.",
        answer: "SELECT * FROM departments WHERE office_location LIKE 'Building A%' AND budget > 200000;",
        sampleOutput: {
            columns: ["id", "name", "budget", "office_location"],
            values: [
                [1, "Engineering", 500000, "Building A, Floor 3"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('like') && !lowerQuery.includes('glob')) {
                return { success: false, message: "Use LIKE with 'Building A%' to match office locations." };
            }
            // Building A depts: Engineering(500k), Finance(300k), Executive(1M) — all > 200k = 3 rows
            if (res.values.length === 3 && res.values.some(row => row.includes('Finance'))) {
                return { success: true, message: "Building A department list audit completed." };
            }
            return { success: false, message: "You should find exactly 3 departments in Building A with budget > 200,000." };
        }
    },
    {
        id: 23,
        title: "Level 23: CEO Direct Reports",
        story: "The CEO, Diana Prince, needs a list of all her direct reports to audit their security clearance keys.",
        task: "Retrieve the names of all employees who report directly to the manager with ID 4.",
        answer: "SELECT name FROM employees WHERE manager_id = 4;",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Alice Smith"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('manager_id') || !lowerQuery.includes('4')) {
                return { success: false, message: "Filter by manager_id = 4." };
            }
            // manager_id=4 (Diana): Alice(1), Bob(2), Eve(5), Frank(6) = 4 rows
            if (res.values.length === 4 && res.values.some(row => row.includes('Alice Smith'))) {
                return { success: true, message: "Direct reports list generated." };
            }
            return { success: false, message: "Your query should return exactly 4 direct reports to manager_id 4." };
        }
    },
    {
        id: 24,
        title: "Level 24: Org Hierarchy Self-Join",
        story: "Let's list all employees along with their manager names. This will help us inspect reporting patterns.",
        task: "Map the organization's reporting lines by retrieving all employees and their manager's names. Alias the employee's name as 'employee_name' and the manager's name as 'manager_name'.",
        answer: "SELECT e.name AS employee_name, m.name AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;",
        sampleOutput: {
            columns: ["employee_name", "manager_name"],
            values: [
                ["Alice Smith", "Diana Prince"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "Perform a self-join on the employees table using LEFT JOIN." };
            }
            if (
                res.columns.includes('employee_name') &&
                res.columns.includes('manager_name') &&
                res.values.length >= 6
            ) {
                return { success: true, message: "Self-joined reporting hierarchy mapped." };
            }
            return { success: false, message: "Select e.name AS employee_name and m.name AS manager_name with a self-join." };
        }
    },
    {
        id: 25,
        title: "Level 25: Intruder Access Alerts",
        story: "Let's gather details about logins that failed. Stolen credentials will show failed attempts before success.",
        task: "Retrieve security access alerts by listing the name, role, login time, and status for all failed login attempts.",
        answer: "SELECT employees.name, employees.role, access_logs.login_time, access_logs.status FROM employees JOIN access_logs ON employees.id = access_logs.employee_id WHERE access_logs.status = 'Failed';",
        sampleOutput: {
            columns: ["name", "role", "login_time", "status"],
            values: [
                ["Eve Davis", "Senior Accountant", "2023-10-06 03:00:00", "Failed"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('failed') || !lowerQuery.includes('join')) {
                return { success: false, message: "Make sure you JOIN the tables and filter WHERE status = 'Failed'." };
            }
            // 2 Failed logins, both by Eve (employee_id=5)
            if (res.values.length === 2 && res.values.every(row => row.includes('Failed'))) {
                return { success: true, message: "Failed logins audit completed." };
            }
            return { success: false, message: "There are exactly 2 failed login attempts in the logs — both by Eve Davis." };
        }
    },
    {
        id: 26,
        title: "Level 26: Subnetwork Blacklist Trace",
        story: "Cross-reference log entries with our blacklisted IP subnet list to see which employee was targeted.",
        task: "Trace logins from blacklisted IPs. Select the login IP address, the target employee's name, and the reason they were blacklisted.",
        answer: "SELECT access_logs.ip_address, employees.name, blacklisted_ips.reason FROM access_logs JOIN employees ON access_logs.employee_id = employees.id JOIN blacklisted_ips ON access_logs.ip_address = blacklisted_ips.ip_address;",
        sampleOutput: {
            columns: ["ip_address", "name", "reason"],
            values: [
                ["198.51.100.72", "Eve Davis", "Brute force attempts"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "You need to perform a multi-table JOIN across access_logs, employees, and blacklisted_ips." };
            }
            // 198.51.100.72 is blacklisted, Eve has 2 Failed logins from that IP
            if (res.values.length >= 1 && res.values.some(row => row.includes('Eve Davis'))) {
                return { success: true, message: "Blacklist correlation trace successful!" };
            }
            return { success: false, message: "Check your join syntax — link access_logs to blacklisted_ips on ip_address." };
        }
    },
    {
        id: 27,
        title: "Level 27: Offshore Wire Auditing",
        story: "Let's query transfer details to map offshore money transfers to specific bank accounts.",
        task: "Audit the offshore transfer logs. Retrieve the transaction ID, description, amount, offshore account number, bank name, and country.",
        answer: "SELECT transactions.id AS transaction_id, transactions.description, transactions.amount, offshore_accounts.account_number, offshore_accounts.bank_name, offshore_accounts.country FROM transfer_logs JOIN transactions ON transfer_logs.transaction_id = transactions.id JOIN offshore_accounts ON transfer_logs.offshore_account_id = offshore_accounts.id;",
        sampleOutput: {
            columns: ["transaction_id", "description", "amount", "account_number", "bank_name", "country"],
            values: [
                [4, "Consulting Fee - Offshore", 45000.00, "KY-8829-X", "Grand Cayman Trust", "Cayman Islands"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "Perform a JOIN across transfer_logs, transactions, and offshore_accounts." };
            }
            // 2 transfer_log entries: transaction 4 → KY (Cayman), transaction 5 → CH (Switzerland)
            if (res.values.length === 2 && res.values.some(row => row.includes('Cayman Islands'))) {
                return { success: true, message: "Offshore accounts wire audit completed." };
            }
            return { success: false, message: "Your query should return 2 rows — one for Cayman Islands and one for Switzerland." };
        }
    },
    {
        id: 28,
        title: "Level 28: Offshore Capital Flow",
        story: "Let's summarize total capital sent to offshore accounts grouped by country to report to international investigators.",
        task: "Find the total amount of money sent to offshore accounts grouped by country. Alias the sum column as 'total_amount'.",
        answer: "SELECT offshore_accounts.country, SUM(transactions.amount) AS total_amount FROM transfer_logs JOIN transactions ON transfer_logs.transaction_id = transactions.id JOIN offshore_accounts ON transfer_logs.offshore_account_id = offshore_accounts.id GROUP BY offshore_accounts.country;",
        sampleOutput: {
            columns: ["country", "total_amount"],
            values: [
                ["Cayman Islands", 45000.00],
                ["Switzerland", 50000.00]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('sum') || !lowerQuery.includes('group by')) {
                return { success: false, message: "Use GROUP BY country and SUM(amount) aliased as total_amount." };
            }
            // Cayman: 45000, Switzerland: 50000
            const swissRow = res.values.find(row => row.includes('Switzerland'));
            const caymanRow = res.values.find(row => row.includes('Cayman Islands'));
            if (swissRow && Number(swissRow[1]) === 50000 && caymanRow && Number(caymanRow[1]) === 45000) {
                return { success: true, message: "Offshore capital destinations mapped." };
            }
            return { success: false, message: "Check your math. Switzerland should total 50,000 and Cayman Islands 45,000." };
        }
    },
    {
        id: 29,
        title: "Level 29: Profile Target Counts",
        story: "Let's rank employees by the frequency of failed logins to see who was the primary target.",
        task: "Count the number of failed login attempts for each employee. Retrieve the employee's name and their failed login count aliased as 'failed_count'.",
        answer: "SELECT employees.name, COUNT(*) AS failed_count FROM employees JOIN access_logs ON employees.id = access_logs.employee_id WHERE access_logs.status = 'Failed' GROUP BY employees.name;",
        sampleOutput: {
            columns: ["name", "failed_count"],
            values: [
                ["Eve Davis", 2]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('count') || !lowerQuery.includes('group by')) {
                return { success: false, message: "Use GROUP BY and COUNT(*) aliased as failed_count." };
            }
            // Only Eve has 2 failed logins
            if (res.values.length === 1 && res.values[0].includes('Eve Davis') && Number(res.values[0][1]) === 2) {
                return { success: true, message: "Eve Davis has 2 failed logins, confirming she was heavily targeted." };
            }
            return { success: false, message: "Filter WHERE status = 'Failed', then GROUP BY employee name. Only Eve Davis should appear with a count of 2." };
        }
    },
    {
        id: 30,
        title: "Level 30: Department Pay Benchmarks",
        story: "Let's check transaction sizes across departments to compare average expenditures.",
        task: "Analyze departmental transaction statistics. Select the department name, the maximum transaction amount (aliased as 'max_transaction'), and the average transaction amount (aliased as 'avg_transaction').",
        answer: "SELECT employees.department, MAX(transactions.amount) AS max_transaction, AVG(transactions.amount) AS avg_transaction FROM employees JOIN transactions ON employees.id = transactions.employee_id GROUP BY employees.department;",
        sampleOutput: {
            columns: ["department", "max_transaction", "avg_transaction"],
            values: [
                ["Finance", 50000.00, 20934.00]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('max') || !lowerQuery.includes('avg') || !lowerQuery.includes('group by')) {
                return { success: false, message: "Use GROUP BY department, MAX(), and AVG()." };
            }
            // Departments with transactions: Engineering, Marketing, Finance, Executive, Security = 5 departments
            if (res.values.length >= 4) {
                return { success: true, message: "Pay and transaction benchmarks computed." };
            }
            return { success: false, message: "Select department, MAX(amount) AS max_transaction, and AVG(amount) AS avg_transaction." };
        }
    },
    {
        id: 31,
        title: "Level 31: Above Average Salaries",
        story: "To detect administrative anomalies, let's find employees who earn more than the company average.",
        task: "Find the name and salary of employees who earn more than the company's average salary.",
        answer: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
        sampleOutput: {
            columns: ["name", "salary"],
            values: [
                ["Diana Prince", 240000]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('avg') || !lowerQuery.includes('select')) {
                return { success: false, message: "Use a subquery to calculate AVG(salary)." };
            }
            // Avg salary = (85000+72000+68000+240000+98000+85000)/6 = 648000/6 = 108000
            // Above average: Eve(98k < 108k no), Diana(240k yes) — only Diana
            if (res.values.length === 1 && res.values[0].includes('Diana Prince')) {
                return { success: true, message: "Only CEO Diana Prince earns above the company average salary of $108,000." };
            }
            return { success: false, message: "Verify your subquery. The average salary is $108,000 — only one employee earns more." };
        }
    },
    {
        id: 32,
        title: "Level 32: Heavy Spenders Subquery",
        story: "Let's locate employees associated with transactions exceeding 40,000 using a subquery.",
        task: "Identify the names of employees who have made any single transaction exceeding 40,000.",
        answer: "SELECT name FROM employees WHERE id IN (SELECT employee_id FROM transactions WHERE amount > 40000);",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Eve Davis"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('in') || !lowerQuery.includes('select')) {
                return { success: false, message: "Use the IN operator with a subquery on transactions." };
            }
            // Transactions > 40000: Eve's 45000 and 50000
            if (res.values.length === 1 && res.values[0].includes('Eve Davis')) {
                return { success: true, message: "Eve Davis is linked to transactions over 40,000." };
            }
            return { success: false, message: "Verify your subquery conditions — only one employee has transactions over 40,000." };
        }
    },
    {
        id: 33,
        title: "Level 33: Spender Outliers",
        story: "Let's isolate employees who have never filed a transaction using a subquery approach.",
        task: "Find the names of employees who have never made a transaction, using NOT IN with a subquery.",
        answer: "SELECT name FROM employees WHERE id NOT IN (SELECT employee_id FROM transactions WHERE employee_id IS NOT NULL);",
        sampleOutput: {
            columns: ["name"],
            values: []
        },
        validator: (results, query) => {
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('not in')) {
                return { success: false, message: "Use the NOT IN operator with a subquery." };
            }
            // All 6 employees have transactions — correct answer returns 0 rows.
            // sql.js returns [] (empty array) when no rows match.
            if (results.length === 0 || (results.length > 0 && results[0].values.length === 0)) {
                return { success: true, message: "Correct! Every employee has at least one transaction on record — no outliers found." };
            }
            return { success: false, message: "Every employee in this dataset has made at least one transaction — the result should be empty." };
        }
    },
    {
        id: 34,
        title: "Level 34: IP Address Checks",
        story: "Let's check which employees have logged in from the suspicious address '192.168.1.5' using EXISTS.",
        task: "Retrieve the names of employees who have logged in from the IP address '192.168.1.5', using the EXISTS operator.",
        answer: "SELECT name FROM employees WHERE EXISTS (SELECT 1 FROM access_logs WHERE access_logs.employee_id = employees.id AND access_logs.ip_address = '192.168.1.5');",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Alice Smith"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('exists')) {
                return { success: false, message: "You must use the EXISTS operator." };
            }
            // IP 192.168.1.5 belongs to Alice (employee_id=1), 2 log entries
            if (res.values.length === 1 && res.values[0].includes('Alice Smith')) {
                return { success: true, message: "EXISTS verification complete — Alice Smith logged in from 192.168.1.5." };
            }
            return { success: false, message: "Only Alice Smith should be returned for IP 192.168.1.5." };
        }
    },
    {
        id: 35,
        title: "Level 35: Department Spends CTE",
        story: "Let's construct a Common Table Expression to list departments whose transaction sums exceed 50,000.",
        task: "Group transactions and calculate total spending per department using a Common Table Expression (CTE) named 'dept_spending'. Select the department name and total spending (aliased as 'total_spent') for departments that spent more than 50,000.",
        answer: "WITH dept_spending AS (SELECT employees.department, SUM(transactions.amount) AS total_spent FROM employees JOIN transactions ON employees.id = transactions.employee_id GROUP BY employees.department) SELECT department, total_spent FROM dept_spending WHERE total_spent > 50000;",
        sampleOutput: {
            columns: ["department", "total_spent"],
            values: [
                ["Finance", 104670.00]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('with') || !lowerQuery.includes('dept_spending')) {
                return { success: false, message: "Use a WITH clause to define a CTE named dept_spending." };
            }
            // Finance total > 50000 (104670), others are well below
            if (res.values.length === 1 && res.values[0].includes('Finance')) {
                return { success: true, message: "Finance isolated using CTE aggregates!" };
            }
            return { success: false, message: "Only Finance exceeds 50,000 in total spending. Verify your CTE logic." };
        }
    },
    {
        id: 36,
        title: "Level 36: Direct Reports CTE",
        story: "Let's build a CTE to map employees to their managers, then query it for Diana's reports.",
        task: "Create a Common Table Expression (CTE) named 'employee_org' that maps employee names (aliased as 'emp_name') to their manager's name (aliased as 'mgr_name'). Query this CTE to list the employee names who report to 'Diana Prince'.",
        answer: "WITH employee_org AS (SELECT e.name AS emp_name, m.name AS mgr_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id) SELECT emp_name FROM employee_org WHERE mgr_name = 'Diana Prince';",
        sampleOutput: {
            columns: ["emp_name"],
            values: [
                ["Alice Smith"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('with') || !lowerQuery.includes('employee_org')) {
                return { success: false, message: "Write a CTE named employee_org." };
            }
            // Diana is manager_id=4 so reports: Alice(1), Bob(2), Eve(5), Frank(6) = 4
            if (res.values.length === 4 && res.values.some(row => row.includes('Alice Smith'))) {
                return { success: true, message: "CTE hierarchy lookup successful!" };
            }
            return { success: false, message: "Your query should return 4 employees who report to Diana Prince." };
        }
    },
    {
        id: 37,
        title: "Level 37: Department Contact UNION",
        story: "Investigators want to merge contact lists for Security and Finance departments.",
        task: "Retrieve a consolidated list of names of all employees who belong to either the 'Security' department or the 'Finance' department (excluding duplicate names).",
        answer: "SELECT name FROM employees WHERE department = 'Security' UNION SELECT name FROM employees WHERE department = 'Finance';",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Frank Castle"],
                ["Charlie Brown"],
                ["Eve Davis"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('union') || lowerQuery.includes('union all')) {
                return { success: false, message: "Use the UNION operator (not UNION ALL) to eliminate duplicates." };
            }
            // Security: Frank(1), Finance: Charlie + Eve(2) = 3 total
            if (res.values.length === 3 && res.values.some(row => row.includes('Frank Castle'))) {
                return { success: true, message: "Security and Finance contacts merged successfully." };
            }
            return { success: false, message: "Verify department names — you should get 3 unique employees total." };
        }
    },
    {
        id: 38,
        title: "Level 38: Active Spender INTERSECT",
        story: "Let's find employee IDs who exist in the employee directory and have also made transactions.",
        task: "Find all employee IDs that exist in the employees directory and have also made transactions.",
        answer: "SELECT id FROM employees INTERSECT SELECT employee_id FROM transactions;",
        sampleOutput: {
            columns: ["id"],
            values: [
                [1], [2], [3], [4], [5], [6]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('intersect')) {
                return { success: false, message: "Use the INTERSECT operator." };
            }
            // All 6 employees have at least one transaction
            if (res.values.length === 6) {
                return { success: true, message: "All 6 employees have transaction records — INTERSECT confirmed." };
            }
            return { success: false, message: "All 6 employees have transactions. INTERSECT should return 6 IDs." };
        }
    },
    {
        id: 39,
        title: "Level 39: Idle Logins EXCEPT",
        story: "Let's find employee IDs who exist in the directory but have never filed a transaction using EXCEPT.",
        task: "Find the employee IDs that exist in the employees directory but have never made any transactions.",
        answer: "SELECT id FROM employees EXCEPT SELECT employee_id FROM transactions WHERE employee_id IS NOT NULL;",
        sampleOutput: {
            columns: ["id"],
            values: []
        },
        validator: (results, query) => {
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('except')) {
                return { success: false, message: "Use the EXCEPT operator." };
            }
            // All 6 employees have transactions — correct answer returns 0 rows.
            // sql.js returns [] (empty array) when no rows match.
            if (results.length === 0 || (results.length > 0 && results[0].values.length === 0)) {
                return { success: true, message: "EXCEPT filter complete — every employee has at least one transaction on record." };
            }
            return { success: false, message: "Every employee has made a transaction — EXCEPT should return an empty set." };
        }
    },
    {
        id: 40,
        title: "Level 40: Fully Traced Wires",
        story: "Sherlock demands a full audit trail linking employees to offshore accounts.",
        task: "Trace the complete path of offshore wire transfers. Retrieve the employee's name, transaction amount, offshore account number, and country.",
        answer: "SELECT employees.name, transactions.amount, offshore_accounts.account_number, offshore_accounts.country FROM employees JOIN transactions ON employees.id = transactions.employee_id JOIN transfer_logs ON transactions.id = transfer_logs.transaction_id JOIN offshore_accounts ON transfer_logs.offshore_account_id = offshore_accounts.id;",
        sampleOutput: {
            columns: ["name", "amount", "account_number", "country"],
            values: [
                ["Eve Davis", 45000.00, "KY-8829-X", "Cayman Islands"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "Perform a four-table JOIN: employees → transactions → transfer_logs → offshore_accounts." };
            }
            // 2 transfer_log rows: Eve→Cayman(45k) and Eve→Switzerland(50k)
            if (res.values.length === 2 && res.values.some(row => row.includes('Cayman Islands'))) {
                return { success: true, message: "Full four-table audit trace complete!" };
            }
            return { success: false, message: "Select name, amount, account_number, country — you should get 2 rows (Cayman Islands and Switzerland)." };
        }
    },
    {
        id: 41,
        title: "Level 41: Transaction Risk Case",
        story: "Let's classify transaction amounts into risk tiers using a CASE statement.",
        task: "Classify transactions based on risk. If the amount is over 10,000, label it 'Critical'; if it is over 1,000, label it 'High'; otherwise label it 'Low'. Select the transaction description, amount, and the classified category aliased as 'risk_level'.",
        answer: "SELECT description, amount, CASE WHEN amount > 10000 THEN 'Critical' WHEN amount > 1000 THEN 'High' ELSE 'Low' END AS risk_level FROM transactions;",
        sampleOutput: {
            columns: ["description", "amount", "risk_level"],
            values: [
                ["Consulting Fee - Offshore", 45000.00, "Critical"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('case') || !lowerQuery.includes('when') || !lowerQuery.includes('risk_level')) {
                return { success: false, message: "Use CASE WHEN ... END AS risk_level." };
            }
            // 11 transactions total, some Critical, some High, some Low
            if (res.values.length >= 6 && res.values.some(row => row.includes('Critical'))) {
                return { success: true, message: "Ledger transaction risk tiers applied successfully." };
            }
            return { success: false, message: "Verify your CASE WHEN conditions and the alias 'risk_level'." };
        }
    },
    {
        id: 42,
        title: "Level 42: Salary Ranks",
        story: "To understand department hierarchies, let's rank employee salaries within each department.",
        task: "Rank employees by salary within each department (highest salary ranked first). Select the employee name, department, salary, and their department salary rank aliased as 'salary_rank'.",
        answer: "SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM employees;",
        sampleOutput: {
            columns: ["name", "department", "salary", "salary_rank"],
            values: [
                ["Alice Smith", "Engineering", 85000, 1]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('row_number') || !lowerQuery.includes('partition') || !lowerQuery.includes('salary_rank')) {
                return { success: false, message: "Use the ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank." };
            }
            if (res.values.length >= 6 && res.values.some(row => row.includes(1))) {
                return { success: true, message: "Window function ranking completed." };
            }
            return { success: false, message: "Verify ROW_NUMBER OVER PARTITION BY syntax." };
        }
    },
    {
        id: 43,
        title: "Level 43: Cumulative Ledger Sum",
        story: "Let's calculate the cumulative transaction sum over time to track capital depletion.",
        task: "Calculate the running cumulative transaction sum over time. Select the transaction ID, amount, and the running sum aliased as 'cumulative_spent' ordered by the transaction date.",
        answer: "SELECT id, amount, SUM(amount) OVER (ORDER BY transaction_date) AS cumulative_spent FROM transactions;",
        sampleOutput: {
            columns: ["id", "amount", "cumulative_spent"],
            values: [
                [1, 150.00, 150.00]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('over') || !lowerQuery.includes('cumulative_spent')) {
                return { success: false, message: "Use SUM(amount) OVER (ORDER BY transaction_date) AS cumulative_spent." };
            }
            if (res.values.length >= 11 && Number(res.values[res.values.length - 1][2]) > 100000) {
                return { success: true, message: "Window function cumulative sum calculated successfully." };
            }
            return { success: false, message: "Verify cumulative sum window parameters — all 11 transaction rows should be returned." };
        }
    },
    {
        id: 44,
        title: "Level 44: Peer Subquery Audits",
        story: "Let's query employees who share the same manager as Alice Smith.",
        task: "Find the names of all employees who share the same manager as 'Alice Smith' (excluding 'Alice Smith' themselves).",
        answer: "SELECT name FROM employees WHERE manager_id = (SELECT manager_id FROM employees WHERE name = 'Alice Smith') AND name != 'Alice Smith';",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Bob Jones"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('select manager_id') && !lowerQuery.includes('select manager_id')) {
                return { success: false, message: "Use a subquery to select Alice's manager_id." };
            }
            // Alice's manager_id=4. Others with manager_id=4: Bob(2), Eve(5), Frank(6) = 3 rows
            if (res.values.length === 3 && res.values.some(row => row.includes('Bob Jones'))) {
                return { success: true, message: "Alice Smith's peer staff members mapped." };
            }
            return { success: false, message: "Excluding Alice, you should return 3 peers: Bob Jones, Eve Davis, and Frank Castle." };
        }
    },
    {
        id: 45,
        title: "Level 45: Route Verification",
        story: "Let's trace offshore accounts connected to transfers routed through the Bahamas.",
        task: "Find the offshore account numbers that received transfers routed through the country 'Bahamas'.",
        answer: "SELECT offshore_accounts.account_number FROM transfer_logs JOIN offshore_accounts ON transfer_logs.offshore_account_id = offshore_accounts.id WHERE transfer_logs.routed_through_country = 'Bahamas';",
        sampleOutput: {
            columns: ["account_number"],
            values: [
                ["KY-8829-X"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('bahamas') || !lowerQuery.includes('join')) {
                return { success: false, message: "Perform a JOIN on transfer_logs and offshore_accounts, then filter WHERE routed_through_country = 'Bahamas'." };
            }
            // transaction 4 is routed via Bahamas → offshore_account_id=1 → KY-8829-X
            if (res.values.length === 1 && res.values[0].includes('KY-8829-X')) {
                return { success: true, message: "Bahamian offshore account isolated: KY-8829-X." };
            }
            return { success: false, message: "Query should return exactly one account number: KY-8829-X." };
        }
    },
    {
        id: 46,
        title: "Level 46: High-Budget Department HAVING",
        story: "Let's find departments whose budgets exceed the average budget of all departments.",
        task: "Identify the departments whose budget is strictly greater than the average budget of all departments.",
        answer: "SELECT name FROM departments GROUP BY name HAVING budget > (SELECT AVG(budget) FROM departments);",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Engineering"],
                ["Executive"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('avg') || (!lowerQuery.includes('having') && !lowerQuery.includes('where'))) {
                return { success: false, message: "Use HAVING (or WHERE) budget > (SELECT AVG(budget) FROM departments)." };
            }
            // Avg = (500000+150000+300000+1000000+250000)/5 = 440000
            // Above avg: Engineering(500k) and Executive(1M) = 2 departments
            if (res.values.length === 2 && res.values.some(row => row.includes('Executive')) && res.values.some(row => row.includes('Engineering'))) {
                return { success: true, message: "High-funded departments identified: Engineering and Executive." };
            }
            return { success: false, message: "The average budget is $440,000. Two departments exceed it: Engineering and Executive." };
        }
    },
    {
        id: 47,
        title: "Level 47: Ledger Audit Flagging",
        story: "Sherlock wants to label the suspicious consulting transaction in the ledger.",
        task: "Flag the highly suspicious transaction of 45,000 on the ledger by updating its description to 'FLAGGED - SUSPICIOUS TRANSACTION' in the 'transactions' table.",
        answer: "UPDATE transactions SET description = 'FLAGGED - SUSPICIOUS TRANSACTION' WHERE amount = 45000;",
        sampleOutput: {
            columns: [],
            values: []
        },
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (
                lowerQuery.includes('update transactions') &&
                lowerQuery.includes('flagged - suspicious transaction') &&
                lowerQuery.includes('45000')
            ) {
                return { success: true, message: "Ledger transaction updated and flagged for audit." };
            }
            return { success: false, message: "Use: UPDATE transactions SET description = 'FLAGGED - SUSPICIOUS TRANSACTION' WHERE amount = 45000;" };
        }
    },
    {
        id: 48,
        title: "Level 48: Log Blacklist Node",
        story: "Our firewall sweeps have detected an unauthorized network address. Let's record it.",
        task: "Log a newly detected intruder threat by inserting the IP '192.168.1.99', risk level 'High', reason 'Data Exfiltration Signature', and detection time '2023-10-12 14:00:00' into the 'blacklisted_ips' table.",
        answer: "INSERT INTO blacklisted_ips (ip_address, risk_level, reason, detected_at) VALUES ('192.168.1.99', 'High', 'Data Exfiltration Signature', '2023-10-12 14:00:00');",
        sampleOutput: {
            columns: [],
            values: []
        },
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (
                lowerQuery.includes('insert into blacklisted_ips') &&
                lowerQuery.includes('192.168.1.99') &&
                lowerQuery.includes('high') &&
                lowerQuery.includes('exfiltration')
            ) {
                return { success: true, message: "Blacklisted IP node added to database." };
            }
            return { success: false, message: "Check your INSERT syntax — make sure you include the IP, risk level 'High', and the 'Data Exfiltration Signature' reason." };
        }
    },
    {
        id: 49,
        title: "Level 49: Correlation Forensic Logs",
        story: "Let's find the names of employees associated with failed logins originating from blacklisted IPs.",
        task: "Identify the unique names of employees who have logged in with a status of 'Failed' from an IP address recorded in the blacklist.",
        answer: "SELECT DISTINCT employees.name FROM employees JOIN access_logs ON employees.id = access_logs.employee_id JOIN blacklisted_ips ON access_logs.ip_address = blacklisted_ips.ip_address WHERE access_logs.status = 'Failed';",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Eve Davis"]
            ]
        },
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join') || !lowerQuery.includes('failed')) {
                return { success: false, message: "JOIN employees, access_logs, and blacklisted_ips, then filter WHERE status = 'Failed'." };
            }
            // 198.51.100.72 is blacklisted. Eve has 2 Failed logins from that IP.
            if (res.values.length === 1 && res.values[0].includes('Eve Davis')) {
                return { success: true, message: "Eve Davis confirmed: failed logins from a blacklisted IP address." };
            }
            return { success: false, message: "Verify your join conditions — only Eve Davis should appear." };
        }
    },
    {
        id: 50,
        title: "Level 50: Security Purge",
        story: "The case is solved! As a final safety sweep, let's delete transfer logs connected to the suspended Panama accounts.",
        task: "Perform a final sweep by purging all transfer logs associated with the bank 'Panama Secure Holdings'.",
        answer: "DELETE FROM transfer_logs WHERE offshore_account_id IN (SELECT id FROM offshore_accounts WHERE bank_name = 'Panama Secure Holdings');",
        sampleOutput: {
            columns: [],
            values: []
        },
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (
                lowerQuery.includes('delete') &&
                lowerQuery.includes('transfer_logs') &&
                lowerQuery.includes('select') &&
                lowerQuery.includes('panama')
            ) {
                return { success: true, message: "Forensics complete! Panama accounts purged. All 50 levels of SQL Detective solved!" };
            }
            return { success: false, message: "Use a DELETE with a subquery: DELETE FROM transfer_logs WHERE offshore_account_id IN (SELECT id FROM offshore_accounts WHERE bank_name = 'Panama Secure Holdings');" };
        }
    }
];
