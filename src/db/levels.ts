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
            if (res.values.length > 0 && Number(res.values[0][0]) >= 118421) {
                return { success: true, message: "Wow, over 118k in total transactions!" };
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
            if (financeRow && (financeRow.some(val => Number(val) === 104620))) {
                return { success: true, message: "Spot on! The Finance department is indeed the source of major capital outflows." };
            }
            return { success: false, message: "Double check your SUM and JOIN logic. Finance should show a total of 104,620.00." };
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
                return { success: true, message: "Evidence secured! The database has been purged and access logs are clean." };
            }
            return { success: false, message: "Use query: DELETE FROM access_logs WHERE employee_id = 5;" };
        }
    },
    {
        id: 16,
        title: "Level 16: High Earners Audit",
        story: "Corporate payroll wants to make sure all administrative high earners are accounted for during the heist audits.",
        task: "Select all columns from the 'employees' table where the salary is strictly greater than 80000.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('where') || !lowerQuery.includes('salary')) {
                return { success: false, message: "Make sure to use a WHERE filter on salary." };
            }
            if (res.values.length === 3 && res.values.some(row => row.includes('Alice Smith')) && res.values.some(row => row.includes('Diana Prince'))) {
                return { success: true, message: "High earners isolated successfully!" };
            }
            return { success: false, message: "Check your logic. Make sure salary > 80000." };
        }
    },
    {
        id: 17,
        title: "Level 17: Date-Bound Auditing",
        story: "The major financial discrepancies occurred within a critical 3-day window in October.",
        task: "Select all columns from 'transactions' where transaction_date is between '2023-10-04' and '2023-10-06' inclusive.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('between') && (!lowerQuery.includes('>=') || !lowerQuery.includes('<='))) {
                return { success: false, message: "Use BETWEEN or comparable operators for dates." };
            }
            if (res.values.length === 3 && res.values.some(row => row.includes('Consulting Fee - Offshore'))) {
                return { success: true, message: "Discrepancy timeframe transactions isolated." };
            }
            return { success: false, message: "You should find exactly 3 transactions in this date range." };
        }
    },
    {
        id: 18,
        title: "Level 18: Ledger Size",
        story: "Let's count the total size of the transaction log. We need to verify if any rows were deleted.",
        task: "Write a query to find the total COUNT(*) of rows in the 'transactions' table.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('count')) {
                return { success: false, message: "You must use the COUNT() function." };
            }
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
        task: "Write a query to select all unique (distinct) roles from the 'employees' table.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('distinct')) {
                return { success: false, message: "You must use the DISTINCT keyword." };
            }
            if (res.values.length === 5 || res.values.length === 6) {
                return { success: true, message: "Unique roles extracted successfully!" };
            }
            return { success: false, message: "Double check your DISTINCT role selection." };
        }
    },
    {
        id: 20,
        title: "Level 20: Top Spenders",
        story: "We need to find the three absolute largest transactions on the ledger to present to executive management.",
        task: "Select all columns from transactions, ordered by amount in descending order, and limit the results to the top 3.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('order by') || !lowerQuery.includes('desc') || !lowerQuery.includes('limit')) {
                return { success: false, message: "Make sure you ORDER BY amount DESC and LIMIT 3." };
            }
            if (res.values.length === 3 && Number(res.values[0][2]) === 50000) {
                return { success: true, message: "Top 3 spenders identified. High value targets confirmed." };
            }
            return { success: false, message: "Check your sorting and limit syntax." };
        }
    },
    {
        id: 21,
        title: "Level 21: Department Budget Check",
        story: "Let's cross reference our staff with the departments table to inspect department budgets.",
        task: "Select the employee name and their department budget by joining 'employees' and 'departments' ON department = departments.name.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "You must perform a JOIN." };
            }
            if (res.columns.includes('name') && res.values.length >= 6) {
                return { success: true, message: "Staff-to-budget mapping completed successfully!" };
            }
            return { success: false, message: "Make sure you SELECT name and budget from the joined tables." };
        }
    },
    {
        id: 22,
        title: "Level 22: Building A Operations",
        story: "Security reports suggest the compromised servers were located in Building A. Let's look up departments housed there with substantial budgets.",
        task: "Select all columns from 'departments' where budget is greater than 200000 and office_location starts with 'Building A'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('like') && !lowerQuery.includes('glob')) {
                return { success: false, message: "Use LIKE with 'Building A%' to match office locations." };
            }
            if (res.values.length === 3 && res.values.some(row => row.includes('Finance'))) {
                return { success: true, message: "Building A department list audit completed." };
            }
            return { success: false, message: "You should find exactly 3 departments in Building A with budget > 200000." };
        }
    },
    {
        id: 23,
        title: "Level 23: CEO Direct Reports",
        story: "The CEO, Diana Prince, needs a list of all her direct reports to audit their security clearance keys.",
        task: "Select the name of all employees who report directly to Diana Prince (manager_id = 4).",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('4') && !lowerQuery.includes('manager_id')) {
                return { success: false, message: "Filter by manager_id = 4." };
            }
            if (res.values.length === 4 && res.values.some(row => row.includes('Alice Smith'))) {
                return { success: true, message: "Direct reports list generated." };
            }
            return { success: false, message: "Your query should return exactly 4 direct reports." };
        }
    },
    {
        id: 24,
        title: "Level 24: Org Hierarchy Self-Join",
        story: "Let's list all employees along with their manager names. This will help us inspect reporting patterns.",
        task: "Perform a LEFT JOIN of 'employees' (aliased as e) to 'employees' (aliased as m) ON e.manager_id = m.id, selecting e.name AS employee_name and m.name AS manager_name.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('left join') && !lowerQuery.includes('join')) {
                return { success: false, message: "Perform a self-join using LEFT JOIN." };
            }
            if (res.columns.includes('employee_name') && res.columns.includes('manager_name') && res.values.length >= 6) {
                return { success: true, message: "Self-joined reporting hierarchy mapped." };
            }
            return { success: false, message: "Select employee_name and manager_name with matching aliases." };
        }
    },
    {
        id: 25,
        title: "Level 25: Intruder Access Alerts",
        story: "Let's gather details about logins that failed. Stolen credentials will show failed attempts before success.",
        task: "Write a query joining 'employees' and 'access_logs' to select name, role, login_time, and status where status = 'Failed'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('failed') || !lowerQuery.includes('join')) {
                return { success: false, message: "Make sure you JOIN the tables and filter WHERE status = 'Failed'." };
            }
            if (res.values.length === 2 && res.values.every(row => row.includes('Failed'))) {
                return { success: true, message: "Failed logins audit completed." };
            }
            return { success: false, message: "Make sure you query name, role, login_time, and status." };
        }
    },
    {
        id: 26,
        title: "Level 26: Subnetwork Blacklist Trace",
        story: "Cross-reference log entries with our blacklisted IP subnet list to see which employee was targeted.",
        task: "JOIN 'access_logs', 'blacklisted_ips', and 'employees' to select access_logs.ip_address, employees.name, and blacklisted_ips.reason.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "You need to perform a three-table JOIN." };
            }
            if (res.values.length >= 1 && res.values.some(row => row.includes('Eve Davis'))) {
                return { success: true, message: "Blacklist correlation trace successful!" };
            }
            return { success: false, message: "Check your join syntax." };
        }
    },
    {
        id: 27,
        title: "Level 27: Offshore Wire Auditing",
        story: "Let's query transfer details to map offshore money transfers to specific bank accounts.",
        task: "Select transaction_id, description, amount, account_number, bank_name, and country by joining 'transfer_logs', 'transactions', and 'offshore_accounts'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "Perform a three-table JOIN." };
            }
            if (res.values.length === 2 && res.values.some(row => row.includes('Switzerland'))) {
                return { success: true, message: "Offshore accounts wire audit completed." };
            }
            return { success: false, message: "Query transaction_id, description, amount, account_number, bank_name, country." };
        }
    },
    {
        id: 28,
        title: "Level 28: Offshore Capital Flow",
        story: "Let's summarize total capital sent to offshore accounts grouped by country to report to international investigators.",
        task: "JOIN 'transfer_logs', 'transactions', and 'offshore_accounts', GROUP BY country, and select country and SUM(amount) AS total_amount.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('sum') || !lowerQuery.includes('group by')) {
                return { success: false, message: "Use GROUP BY country and SUM(amount)." };
            }
            const swissRow = res.values.find(row => row.includes('Switzerland'));
            if (swissRow && Number(swissRow[1]) === 50000) {
                return { success: true, message: "Offshore capital destinations mapped." };
            }
            return { success: false, message: "Check your math. Switzerland should have 50000, Cayman Islands 45000." };
        }
    },
    {
        id: 29,
        title: "Level 29: Profile Target Counts",
        story: "Let's rank employees by the frequency of failed logins to see who was the primary target.",
        task: "JOIN 'employees' and 'access_logs', filter WHERE status = 'Failed', GROUP BY name, and select name and COUNT(*) AS failed_count.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('count') || !lowerQuery.includes('group by')) {
                return { success: false, message: "Use GROUP BY name and COUNT(*)." };
            }
            if (res.values.length === 1 && res.values[0].includes('Eve Davis') && Number(res.values[0][1]) === 2) {
                return { success: true, message: "Eve Davis has 2 failed logins, confirming she was heavily targeted." };
            }
            return { success: false, message: "Verify your query filters." };
        }
    },
    {
        id: 30,
        title: "Level 30: Department Pay Benchmarks",
        story: "Let's check transaction sizes across departments to compare average expenditures.",
        task: "JOIN 'employees' and 'transactions', GROUP BY department, and select department, MAX(amount) AS max_transaction, and AVG(amount) AS avg_transaction.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('max') || !lowerQuery.includes('avg') || !lowerQuery.includes('group by')) {
                return { success: false, message: "Use GROUP BY department, MAX(), and AVG()." };
            }
            if (res.values.length >= 4) {
                return { success: true, message: "Pay and transaction benchmarks computed." };
            }
            return { success: false, message: "Select department, MAX(amount), and AVG(amount)." };
        }
    },
    {
        id: 31,
        title: "Level 31: Above Average Salaries",
        story: "To detect administrative anomalies, let's find employees who earn more than the company average.",
        task: "Select name and salary from employees where salary is greater than the average salary of all employees (use a subquery).",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('select avg(salary)')) {
                return { success: false, message: "Use a subquery to calculate AVG(salary)." };
            }
            if (res.values.length === 1 && res.values[0].includes('Diana Prince')) {
                return { success: true, message: "Only CEO Diana Prince earns above the company average." };
            }
            return { success: false, message: "Verify that only the CEO is returned." };
        }
    },
    {
        id: 32,
        title: "Level 32: Heavy Spenders Subquery",
        story: "Let's locate employees associated with transactions exceeding 40,000 using a subquery.",
        task: "Select name from employees where id IN (select distinct employee_id from transactions where amount > 40000).",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('in') || !lowerQuery.includes('select')) {
                return { success: false, message: "Use the IN operator with a subquery." };
            }
            if (res.values.length === 1 && res.values[0].includes('Eve Davis')) {
                return { success: true, message: "Eve Davis linked to the transaction subquery." };
            }
            return { success: false, message: "Verify your subquery conditions." };
        }
    },
    {
        id: 33,
        title: "Level 33: Spender Outliers",
        story: "Let's isolate employees who have never filed a transaction using a subquery.",
        task: "Select name from employees where id NOT IN (select distinct employee_id from transactions).",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('not in')) {
                return { success: false, message: "Use the NOT IN operator with a subquery." };
            }
            if (res.values.length >= 1 && res.values.some(row => row.includes('Frank Castle'))) {
                return { success: true, message: "Frank Castle has never made a transaction." };
            }
            return { success: false, message: "Verify your query logic." };
        }
    },
    {
        id: 34,
        title: "Level 34: IP Address Checks",
        story: "Let's check if Alice Smith has logged in from the suspicious address '192.168.1.5' using EXISTS.",
        task: "Select name from employees e where EXISTS (select 1 from access_logs a where a.employee_id = e.id and a.ip_address = '192.168.1.5').",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('exists')) {
                return { success: false, message: "You must use the EXISTS operator." };
            }
            if (res.values.length === 1 && res.values[0].includes('Alice Smith')) {
                return { success: true, message: "EXISTS verification complete." };
            }
            return { success: false, message: "Query should find exactly Alice Smith." };
        }
    },
    {
        id: 35,
        title: "Level 35: Department Spends CTE",
        story: "Let's construct a Common Table Expression to list departments whose transaction sums exceed 50,000.",
        task: "Write a CTE named 'dept_spending' summing transaction amount grouped by department, then SELECT department, total_spent FROM dept_spending WHERE total_spent > 50000.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('with') || !lowerQuery.includes('dept_spending')) {
                return { success: false, message: "Use a WITH clause named dept_spending." };
            }
            if (res.values.length === 1 && res.values[0].includes('Finance')) {
                return { success: true, message: "Finance isolated using CTE aggregates!" };
            }
            return { success: false, message: "Query should return Finance." };
        }
    },
    {
        id: 36,
        title: "Level 36: Direct Reports CTE",
        story: "Let's build a CTE to map employees to their managers, then query it for Diana's reports.",
        task: "Write a CTE named 'employee_org' returning employee name (emp_name) and manager name (mgr_name), then SELECT emp_name FROM employee_org WHERE mgr_name = 'Diana Prince'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('with') || !lowerQuery.includes('employee_org')) {
                return { success: false, message: "Write a CTE named employee_org." };
            }
            if (res.values.length === 4 && res.values.some(row => row.includes('Alice Smith'))) {
                return { success: true, message: "CTE hierarchy lookup successful!" };
            }
            return { success: false, message: "Your query should return 4 names." };
        }
    },
    {
        id: 37,
        title: "Level 37: Department Contact UNION",
        story: "Investigators want to merge list contacts for Security and Finance departments.",
        task: "Select name from employees where department = 'Security' UNION select name from employees where department = 'Finance'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('union') || lowerQuery.includes('union all')) {
                return { success: false, message: "Use the UNION operator (which removes duplicates)." };
            }
            if (res.values.length >= 3 && res.values.some(row => row.includes('Frank Castle'))) {
                return { success: true, message: "Security and Finance contacts merged." };
            }
            return { success: false, message: "Verify department values." };
        }
    },
    {
        id: 38,
        title: "Level 38: Active Spender INTERSECT",
        story: "Let's find employee IDs who have logged in and also have transaction records.",
        task: "Select id from employees INTERSECT select distinct employee_id from transactions.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('intersect')) {
                return { success: false, message: "Use the INTERSECT operator." };
            }
            if (res.values.length === 5 && res.values.every(row => Number(row[0]) <= 5)) {
                return { success: true, message: "Common employees intersected successfully." };
            }
            return { success: false, message: "Verify transaction records." };
        }
    },
    {
        id: 39,
        title: "Level 39: Idle Logins EXCEPT",
        story: "Let's find employee IDs who have entries but have never filed a transaction using EXCEPT.",
        task: "Select id from employees EXCEPT select distinct employee_id from transactions.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('except')) {
                return { success: false, message: "Use the EXCEPT operator." };
            }
            if (res.values.length >= 1 && res.values.some(row => Number(row[0]) === 6)) {
                return { success: true, message: "Except filter completed. Frank Castle isolated." };
            }
            return { success: false, message: "Verify transaction records." };
        }
    },
    {
        id: 40,
        title: "Level 40: Fully Traced Wires",
        story: "Sherlock demands a full audit trail linking employees to offshore accounts.",
        task: "JOIN employees, transactions, transfer_logs, and offshore_accounts to select name, amount, account_number, and country.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join')) {
                return { success: false, message: "Perform a four-table JOIN." };
            }
            if (res.values.length === 2 && res.values.some(row => row.includes('Cayman Islands'))) {
                return { success: true, message: "Full four-table audit trace complete!" };
            }
            return { success: false, message: "Select name, amount, account_number, country." };
        }
    },
    {
        id: 41,
        title: "Level 41: Transaction Risk Case",
        story: "Let's classify transaction amounts into risk tiers using a CASE statement.",
        task: "Select description, amount, and a CASE column named 'risk_level' (if amount > 10000 then 'Critical', if amount > 1000 then 'High', else 'Low').",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('case') || !lowerQuery.includes('when') || !lowerQuery.includes('risk_level')) {
                return { success: false, message: "Use CASE WHEN ... END AS risk_level." };
            }
            if (res.values.length >= 6 && res.values.some(row => row.includes('Critical'))) {
                return { success: true, message: "Ledger transaction risk tiers applied." };
            }
            return { success: false, message: "Verify your CASE WHEN conditions." };
        }
    },
    {
        id: 42,
        title: "Level 42: Salary Ranks",
        story: "To understand department hierarchies, let's rank employee salaries within each department.",
        task: "Select name, department, salary, and ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank from employees.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('row_number') || !lowerQuery.includes('partition') || !lowerQuery.includes('salary_rank')) {
                return { success: false, message: "Use the ROW_NUMBER() window function aliased as salary_rank." };
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
        story: "Let's calculate the cumulative transaction sum over time to track depletion values.",
        task: "Select id, amount, SUM(amount) OVER (ORDER BY transaction_date) AS cumulative_spent from transactions.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('over') || !lowerQuery.includes('cumulative_spent')) {
                return { success: false, message: "Use SUM(amount) OVER (ORDER BY transaction_date) as cumulative_spent." };
            }
            if (res.values.length >= 11 && Number(res.values[res.values.length - 1][2]) >= 118000) {
                return { success: true, message: "Window function cumulative spent calculated." };
            }
            return { success: false, message: "Verify cumulative sum window parameters." };
        }
    },
    {
        id: 44,
        title: "Level 44: Peer Subquery Audits",
        story: "Let's query employees who share the same manager as Alice Smith.",
        task: "Select name from employees where manager_id = (select manager_id from employees where name = 'Alice Smith') and name <> 'Alice Smith'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('select manager_id')) {
                return { success: false, message: "Use a subquery to select Alice's manager_id." };
            }
            if (res.values.length === 3 && res.values.some(row => row.includes('Bob Jones'))) {
                return { success: true, message: "Alice Smith's peer staff members mapped." };
            }
            return { success: false, message: "Check your logic. Excluding Alice, it should return Bob, Eve, Frank." };
        }
    },
    {
        id: 45,
        title: "Level 45: Route Verification",
        story: "Let's trace offshore accounts connected to transfers routed through the Bahamas.",
        task: "Select account_number from offshore_accounts join transfer_logs on offshore_accounts.id = transfer_logs.offshore_account_id where routed_through_country = 'Bahamas'.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('bahamas') || !lowerQuery.includes('join')) {
                return { success: false, message: "Perform a JOIN and filter WHERE routed_through_country = 'Bahamas'." };
            }
            if (res.values.length === 1 && res.values[0].includes('KY-8829-X')) {
                return { success: true, message: "Bahamian offshore accounts isolated." };
            }
            return { success: false, message: "Query should return account number KY-8829-X." };
        }
    },
    {
        id: 46,
        title: "Level 46: High-Budget Department HAVING",
        story: "Let's find departments whose budgets exceed the average budget of all departments.",
        task: "Select name from departments group by name having budget > (select avg(budget) from departments).",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('having') || !lowerQuery.includes('avg')) {
                return { success: false, message: "Use HAVING budget > (select avg(budget) ...)." };
            }
            if (res.values.length === 2 && res.values.some(row => row.includes('Executive'))) {
                return { success: true, message: "High-funded departments mapped using HAVING subquery." };
            }
            return { success: false, message: "Check your aggregates. Average is 440k." };
        }
    },
    {
        id: 47,
        title: "Level 47: Ledger Audit Flagging",
        story: "Sherlock wants to label the suspicious consulting transaction in the ledger.",
        task: "Write an UPDATE query to set the description to 'FLAGGED - SUSPICIOUS TRANSACTION' in the 'transactions' table for the record with amount = 45000.",
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('update transactions') && lowerQuery.includes('flagged - suspicious transaction') && lowerQuery.includes('45000')) {
                return { success: true, message: "Ledger transaction updated and flagged for audit." };
            }
            return { success: false, message: "Use UPDATE transactions SET description = 'FLAGGED - SUSPICIOUS TRANSACTION' WHERE amount = 45000;" };
        }
    },
    {
        id: 48,
        title: "Level 48: Log Blacklist Node",
        story: "Our firewall sweeps have detected an unauthorized network address. Let's record it.",
        task: "Write an INSERT query to add the IP '192.168.1.99', risk_level 'High', reason 'Data Exfiltration Signature', and detected_at '2023-10-12 14:00:00' to the 'blacklisted_ips' table.",
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('insert into blacklisted_ips') && lowerQuery.includes('192.168.1.99') && lowerQuery.includes('high') && lowerQuery.includes('exfiltration')) {
                return { success: true, message: "Blacklisted IP node added to database." };
            }
            return { success: false, message: "Verify IP insert columns and values." };
        }
    },
    {
        id: 49,
        title: "Level 49: Correlation Forensic Logs",
        story: "Let's find the names of employees associated with failed logins originating from blacklisted IPs.",
        task: "JOIN 'employees', 'access_logs', and 'blacklisted_ips' to select the DISTINCT name of employees who have failed logins from blacklisted IPs.",
        validator: (results, query) => {
            if (results.length === 0) return { success: false, message: "No results returned." };
            const res = results[0];
            const lowerQuery = query.toLowerCase();
            if (!lowerQuery.includes('join') || !lowerQuery.includes('failed')) {
                return { success: false, message: "JOIN employees, access_logs, and blacklisted_ips, filtering on Failed." };
            }
            if (res.values.length === 1 && res.values[0].includes('Eve Davis')) {
                return { success: true, message: "Eve Davis linked to the blacklisted IP intruder logs." };
            }
            return { success: false, message: "Verify your join conditions." };
        }
    },
    {
        id: 50,
        title: "Level 50: Security Purge",
        story: "The case is solved! As a final safety sweep, let's delete transfer logs connected to the suspended Panama accounts.",
        task: "Write a DELETE query to purge all entries from 'transfer_logs' where offshore_account_id = (select id from offshore_accounts where bank_name = 'Panama Secure Holdings').",
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('delete') && lowerQuery.includes('transfer_logs') && lowerQuery.includes('select') && lowerQuery.includes('panama')) {
                return { success: true, message: "Forensics complete! Panama accounts purged. All 50 levels of SQL Detective solved!" };
            }
            return { success: false, message: "Verify your DELETE condition subquery." };
        }
    }
];
