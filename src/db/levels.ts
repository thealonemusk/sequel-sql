export interface QueryResult {
    columns: string[];
    values: any[][];
}

export interface Level {
    id: number;
    title: string;
    story: string;
    task: string;
    validator: (results: QueryResult[], query: string) => { success: boolean; message: string };
}

export const levels: Level[] = [
    {
        id: 1,
        title: "Level 1: The First Day",
        story: "Welcome to OmniCorp, Data Analyst. It's your first day on the job, but things are already chaotic. Rumor has it that a large sum of money has gone missing. Before we panic, let's just get familiar with our team.",
        task: "Write a query to retrieve all records from the 'employees' table.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const hasAllColumns = res.columns.includes('id') && res.columns.includes('name') && res.columns.includes('department');
            const isSelectAll = query.toLowerCase().includes('select * from employees') || query.toLowerCase().includes('select * from employees;');
            if (hasAllColumns && (res.values.length >= 6 || isSelectAll)) {
                return { success: true, message: "Great job! You found the employee directory." };
            }
            return { success: false, message: "Make sure you SELECT * FROM employees." };
        }
    },
    {
        id: 2,
        title: "Level 2: Midnight Oil",
        story: "Security noticed some unusual activity in the system logs. Someone was logged into the internal servers very late at night. We need to find out who it was.",
        task: "Query the 'access_logs' table to find logins that occurred after 22:00:00 (10:00 PM). Hint: Use WHERE login_time > '2023-10-01 22:00:00'",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('where')) {
                return { success: false, message: "You need to use a WHERE clause to filter the results." };
            }
            if (res.values.length === 2 && res.values.some(row => row.includes('10.0.0.45'))) {
                return { success: true, message: "Excellent! You found the suspicious late-night logins." };
            }
            return { success: false, message: "That doesn't look quite right. We should only see 2 records." };
        }
    },
    {
        id: 3,
        title: "Level 3: Follow the Money",
        story: "Those late-night logins coincide with some massive outgoing transactions. Let's see which department is burning through cash.",
        task: "Use GROUP BY on the 'transactions' table (joined with employees, or just by employee_id for now) to find the total sum of amount. Let's start simple: Get the total SUM(amount) from transactions.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('sum')) {
                 return { success: false, message: "You need to use the SUM() function." };
            }
            const res = results[0];
            if (res.values.length > 0 && res.values[0][0] == 96900.5) {
                return { success: true, message: "Wow, almost 97k in total transactions!" };
            }
            return { success: false, message: "Make sure you are querying SUM(amount) FROM transactions." };
        }
    },
    {
        id: 4,
        title: "Level 4: Connecting the Dots",
        story: "We need names, not just IDs. Let's join the tables to see exactly who made these transactions.",
        task: "Write a query that INNER JOINs 'employees' and 'transactions' ON employee_id, and SELECT the employee name and transaction amount.",
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
        task: "Using the same JOIN, filter the results WHERE amount > 10000.",
        validator: (results) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            if (res.values.length === 2 && res.values.some(row => row.includes('Eve Davis'))) {
                return { success: true, message: "Eve Davis! She is the one making those massive payments." };
            }
            return { success: false, message: "You should find exactly 2 transactions over 10,000." };
        }
    },
    {
        id: 6,
        title: "Level 6: Case Closed",
        story: "We have our suspect! Eve Davis from Finance has been wiring money to offshore LLCs in the middle of the night. Let's secure her account.",
        task: "Write an UPDATE query to change the 'role' of 'Eve Davis' in the employees table to 'Suspended'. Note: there is no output for UPDATE, just success.",
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('update employees') && lowerQuery.includes("set role") && lowerQuery.includes("suspended")) {
                 return { success: true, message: "Account suspended! You saved OmniCorp." };
            }
            return { success: false, message: "Make sure you UPDATE employees SET role = 'Suspended' WHERE name = 'Eve Davis';" };
        }
    },
    {
        id: 7,
        title: "Level 7: Access Mapping",
        story: "Although Eve is suspended, we need to gather statistics on access logs to identify other potentially compromised machines. Let's inspect login frequencies by IP.",
        task: "Write a query to count the number of logins from each 'ip_address' in the 'access_logs' table, grouped by 'ip_address'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('group by') || !lowerQuery.includes('count')) {
                return { success: false, message: "You need to use GROUP BY and COUNT()." };
            }
            if (res.values.length >= 4) {
                return { success: true, message: "Excellent! You successfully mapped access volume to IP addresses." };
            }
            return { success: false, message: "Make sure you SELECT ip_address and COUNT(*) grouped by ip_address." };
        }
    },
    {
        id: 8,
        title: "Level 8: Expense Auditing",
        story: "Let's perform a department-wide expenditure check. We need to identify total expenses for each department, helping security locate where corporate funds are leaking.",
        task: "Write a query that JOINs 'employees' and 'transactions', groups by 'department', and calculates the SUM of 'amount' for each department.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join') || !lowerQuery.includes('group by') || !lowerQuery.includes('sum')) {
                return { success: false, message: "Make sure to JOIN the tables, GROUP BY department, and calculate SUM(amount)." };
            }
            const financeRow = res.values.find(row => row.some(val => String(val) === 'Finance'));
            if (financeRow && (financeRow.some(val => Number(val) === 95050))) {
                return { success: true, message: "Spot on! The Finance department is indeed the source of major capital outflows." };
            }
            return { success: false, message: "Double check your SUM and JOIN logic. Finance should show a total of 95,050.00." };
        }
    },
    {
        id: 9,
        title: "Level 9: Quiet Accounts",
        story: "Some employees might have been dormant. Let's find employees who have never made a single corporate transaction, as their credentials might have been stolen to bypass transaction limits.",
        task: "Write a query using a LEFT JOIN to find the names of employees who have no transactions in the 'transactions' table (where transactions.employee_id IS NULL).",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('left join')) {
                return { success: false, message: "Make sure to use a LEFT JOIN." };
            }
            if (!lowerQuery.includes('null')) {
                return { success: false, message: "You need to filter WHERE transactions.employee_id IS NULL." };
            }
            if (res.values.length === 1 && res.values[0].includes('Frank Castle')) {
                return { success: true, message: "Great! Frank Castle has a clean sheet with zero transactions, ruling him out." };
            }
            return { success: false, message: "Your query should return exactly one employee: Frank Castle." };
        }
    },
    {
        id: 10,
        title: "Level 10: Suspicious Subnet Access",
        story: "Security reports that all unauthorized server logins came from the local IP subnet '10.0.0.x'. Let's identify the names of all employees who have logged in from these IP addresses.",
        task: "Write a query to select the DISTINCT names of employees who have logged in from an IP address starting with '10.0.0.%'. Join 'employees' and 'access_logs'.",
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
        task: "Write an INSERT query to add an employee named 'Sherlock Holmes' in the 'Security' department with the role 'Lead Investigator'.",
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('insert into employees') && lowerQuery.includes('sherlock holmes') && lowerQuery.includes('security') && lowerQuery.includes('lead investigator')) {
                return { success: true, message: "Welcome to the team, detective Sherlock Holmes! Investigator record successfully created." };
            }
            return { success: false, message: "Check your syntax: INSERT INTO employees (name, department, role) VALUES ('Sherlock Holmes', 'Security', 'Lead Investigator');" };
        }
    },
    {
        id: 12,
        title: "Level 12: Wire Transfers Audit",
        story: "Sherlock suspects the money was laundered using offshore shell companies. Let's isolate all transaction descriptions that mention 'Offshore' or 'LLC'.",
        task: "Select all columns from the 'transactions' table where the description contains either 'Offshore' or 'LLC'. Hint: Use LIKE with OR.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('like') || !lowerQuery.includes('or')) {
                return { success: false, message: "Make sure you use LIKE and OR to check both descriptions." };
            }
            if (res.values.length === 2 && res.values.some(row => row.some(val => String(val).includes('Offshore'))) && res.values.some(row => row.some(val => String(val).includes('LLC')))) {
                return { success: true, message: "Incredible! You isolated the two offshore LLC transactions." };
            }
            return { success: false, message: "Your query should find exactly 2 suspicious transactions: one Offshore and one LLC." };
        }
    },
    {
        id: 13,
        title: "Level 13: Large Average Spenders",
        story: "Let's group transactions by employee, and compute their averages. We want to find employees whose average transaction amount is strictly greater than 1000.",
        task: "Write a query to find the 'employee_id' and the average transaction 'amount' grouped by 'employee_id' where the average is greater than 1000. Hint: Use HAVING AVG(amount) > 1000.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('group by') || !lowerQuery.includes('having') || !lowerQuery.includes('avg')) {
                return { success: false, message: "You need to use GROUP BY, HAVING, and AVG()." };
            }
            if (res.values.length === 2 && res.values.some(row => row.includes(2)) && res.values.some(row => row.includes(5))) {
                return { success: true, message: "Fantastic! You highlighted employees with large average transaction sizes." };
            }
            return { success: false, message: "Check your logic. You should see employee_ids 2 and 5." };
        }
    },
    {
        id: 14,
        title: "Level 14: Finance Ledger Audit",
        story: "Let's audit all transactions associated with employees working in the 'Finance' department to check if anyone else was collaborating with Eve.",
        task: "Write a query that JOINs 'employees' and 'transactions' to select the employee name, transaction description, amount, and transaction_date where the department is 'Finance'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join') || !lowerQuery.includes('where') || !lowerQuery.includes('finance')) {
                return { success: false, message: "Make sure you JOIN the tables and filter WHERE department = 'Finance'." };
            }
            if (res.values.length === 3 && res.values.some(row => row.includes('Charlie Brown')) && res.values.some(row => row.includes('Eve Davis'))) {
                return { success: true, message: "Audit complete! All transactions for Charlie Brown and Eve Davis are listed." };
            }
            return { success: false, message: "Verify your query. There should be 3 rows returned for employees in Finance." };
        }
    },
    {
        id: 15,
        title: "Level 15: Clean Evidence Logs",
        story: "Eve Davis's logs have been secured and duplicated for the legal trial. Security policies dictate we must now purge her internal access logs from the live database to clean up workspace nodes.",
        task: "Write a query to DELETE all records from 'access_logs' where 'employee_id' is 5 (Eve's employee ID).",
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('delete') && lowerQuery.includes('access_logs') && lowerQuery.includes('employee_id') && lowerQuery.includes('5')) {
                return { success: true, message: "Evidence secured! The database has been purged and all 15 detective levels are complete." };
            }
            return { success: false, message: "Use query: DELETE FROM access_logs WHERE employee_id = 5;" };
        }
    }
];
