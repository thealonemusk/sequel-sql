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
        sampleOutput: {
            columns: ["id", "name", "department", "role", "manager_id", "salary", "hire_date"],
            values: [
                [1, "John Doe", "Engineering", "Software Engineer", 4, 75000, "2023-01-15"]
            ]
        },
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
        task: "Find all logins in the 'access_logs' table that occurred after 10:00 PM (22:00:00) on October 1st, 2023.",
        sampleOutput: {
            columns: ["id", "employee_id", "login_time", "ip_address", "status"],
            values: [
                [101, 3, "2023-10-01 22:15:30", "192.168.1.15", "Success"]
            ]
        },
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
        task: "Calculate the total sum of all amounts in the 'transactions' table.",
        sampleOutput: {
            columns: ["SUM(amount)"],
            values: [
                [125000.00]
            ]
        },
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
        task: "Retrieve the names of employees and their transaction amounts by joining the 'employees' and 'transactions' tables.",
        sampleOutput: {
            columns: ["name", "amount"],
            values: [
                ["Alice Smith", 1200.00]
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
        sampleOutput: {
            columns: ["name", "amount"],
            values: [
                ["Bob Jones", 15000.00]
            ]
        },
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
        task: "Suspend 'Eve Davis' by updating her role in the 'employees' table to 'Suspended'.",
        sampleOutput: {
            columns: [],
            values: []
        },
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
        task: "Count the number of logins from each IP address in the 'access_logs' table, grouped by IP address.",
        sampleOutput: {
            columns: ["ip_address", "COUNT(*)"],
            values: [
                ["192.168.1.1", 8]
            ]
        },
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
        task: "Calculate the total transaction amount for each department by combining the employee and transaction records.",
        sampleOutput: {
            columns: ["department", "SUM(amount)"],
            values: [
                ["Sales", 45000.00]
            ]
        },
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
        task: "Find the names of employees who have never made any transactions.",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["John Doe"]
            ]
        },
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
        task: "Find the unique (distinct) names of employees who have logged in from an IP address in the '10.0.0.x' subnet.",
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
        task: "Onboard our new lead investigator by inserting a record for 'Sherlock Holmes' in the 'Security' department with the role 'Lead Investigator' into the 'employees' table.",
        sampleOutput: {
            columns: [],
            values: []
        },
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
        task: "Retrieve all transactions where the transaction description contains either 'Offshore' or 'LLC'.",
        sampleOutput: {
            columns: ["id", "employee_id", "amount", "description", "transaction_date"],
            values: [
                [5, 2, 25000.00, "Payment to Cayman Offshore LLC", "2023-10-04"]
            ]
        },
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
        task: "Find the employee IDs whose average transaction amount is strictly greater than 1,000, along with their average transaction amount.",
        sampleOutput: {
            columns: ["employee_id", "AVG(amount)"],
            values: [
                [3, 1850.00]
            ]
        },
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
        task: "Audit all transactions for employees in the 'Finance' department. Select the employee's name, transaction description, amount, and transaction date.",
        sampleOutput: {
            columns: ["name", "description", "amount", "transaction_date"],
            values: [
                ["Charlie Brown", "Office Supplies", 150.00, "2023-10-02"]
            ]
        },
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
        task: "Purge the access logs for employee ID 5 from the live database by deleting their records from 'access_logs'.",
        sampleOutput: {
            columns: [],
            values: []
        },
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
        task: "Retrieve all employee records from the 'employees' table where the salary is strictly greater than 80,000.",
        sampleOutput: {
            columns: ["id", "name", "department", "role", "manager_id", "salary", "hire_date"],
            values: [
                [4, "Jane Doe", "Executive", "Vice President", null, 95000, "2020-05-10"]
            ]
        },
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
        task: "Retrieve all transactions that occurred between October 4th, 2023, and October 6th, 2023, inclusive.",
        sampleOutput: {
            columns: ["id", "employee_id", "amount", "description", "transaction_date"],
            values: [
                [12, 1, 5000.00, "Services Rendered", "2023-10-05"]
            ]
        },
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
        task: "Count the total number of transaction records on the ledger.",
        sampleOutput: {
            columns: ["COUNT(*)"],
            values: [
                [15]
            ]
        },
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
        task: "Retrieve the list of unique roles held by employees in the company.",
        sampleOutput: {
            columns: ["role"],
            values: [
                ["Analyst"]
            ]
        },
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
        task: "Find the three largest transactions on the ledger, ordered from highest amount to lowest.",
        sampleOutput: {
            columns: ["id", "employee_id", "amount", "description", "transaction_date"],
            values: [
                [8, 2, 75000.00, "Consulting Wire", "2023-10-04"]
            ]
        },
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
        task: "Retrieve each employee's name along with their department's budget.",
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
        sampleOutput: {
            columns: ["id", "name", "budget", "office_location"],
            values: [
                [2, "Engineering", 600000, "Building A, Room 402"]
            ]
        },
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
        task: "Retrieve the names of all employees who report directly to the manager with ID 4.",
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
        task: "Map the organization's reporting lines by retrieving all employees and their manager's names. Alias the employee's name as 'employee_name' and the manager's name as 'manager_name'.",
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
        task: "Retrieve security access alerts by listing the name, role, login time, and status for all failed login attempts.",
        sampleOutput: {
            columns: ["name", "role", "login_time", "status"],
            values: [
                ["John Doe", "Analyst", "2023-10-01 23:05:00", "Failed"]
            ]
        },
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
        task: "Trace logins from blacklisted IPs. Select the login IP address, the target employee's name, and the reason they were blacklisted.",
        sampleOutput: {
            columns: ["ip_address", "name", "reason"],
            values: [
                ["10.0.0.45", "Eve Davis", "Known Hacker Subnet"]
            ]
        },
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
        task: "Audit the offshore transfer logs. Retrieve the transaction ID, description, amount, offshore account number, bank name, and country.",
        sampleOutput: {
            columns: ["transaction_id", "description", "amount", "account_number", "bank_name", "country"],
            values: [
                [14, "Wire transfer offshore", 25000, "CH-992-B", "Zurich Credit", "Switzerland"]
            ]
        },
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
        task: "Find the total amount of money sent to offshore accounts grouped by country. Alias the sum column as 'total_amount'.",
        sampleOutput: {
            columns: ["country", "total_amount"],
            values: [
                ["Switzerland", 50000]
            ]
        },
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
        task: "Count the number of failed login attempts for each employee. Retrieve the employee's name and their failed login count aliased as 'failed_count'.",
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
        task: "Analyze departmental transaction statistics. Select the department name, the maximum transaction amount (aliased as 'max_transaction'), and the average transaction amount (aliased as 'avg_transaction').",
        sampleOutput: {
            columns: ["department", "max_transaction", "avg_transaction"],
            values: [
                ["Finance", 50000.00, 15000.00]
            ]
        },
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
        task: "Find the name and salary of employees who earn more than the company's average salary.",
        sampleOutput: {
            columns: ["name", "salary"],
            values: [
                ["Diana Prince", 150000]
            ]
        },
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
        task: "Identify the names of employees who have made any single transaction exceeding 40,000.",
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
        task: "Find the names of employees who have never made a transaction.",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Frank Castle"]
            ]
        },
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
        task: "Retrieve the names of employees who have logged in from the IP address '192.168.1.5'.",
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
        task: "Group transactions and calculate total spending per department using a Common Table Expression (CTE) named 'dept_spending'. Select the department name and total spending (aliased as 'total_spent') for departments that spent more than 50,000.",
        sampleOutput: {
            columns: ["department", "total_spent"],
            values: [
                ["Finance", 104620]
            ]
        },
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
        task: "Create a Common Table Expression (CTE) named 'employee_org' that maps employee names (aliased as 'emp_name') to their manager's name (aliased as 'mgr_name'). Query this CTE to list the employee names who report to 'Diana Prince'.",
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
        task: "Retrieve a consolidated list of names of all employees who belong to either the 'Security' department or the 'Finance' department (excluding duplicate names).",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Frank Castle"]
            ]
        },
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
        task: "Find all employee IDs that exist in the employees directory and have also made transactions.",
        sampleOutput: {
            columns: ["id"],
            values: [
                [1]
            ]
        },
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
        task: "Find the employee IDs that exist in the employees directory but have never made any transactions.",
        sampleOutput: {
            columns: ["id"],
            values: [
                [6]
            ]
        },
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
        task: "Trace the complete path of offshore wire transfers. Retrieve the employee's name, transaction amount, offshore account number, and country.",
        sampleOutput: {
            columns: ["name", "amount", "account_number", "country"],
            values: [
                ["Eve Davis", 50000, "CH-8920-Y", "Switzerland"]
            ]
        },
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
        task: "Classify transactions based on risk. If the amount is over 10,000, label it 'Critical'; if it is over 1,000, label it 'High'; otherwise label it 'Low'. Select the transaction description, amount, and the classified category aliased as 'risk_level'.",
        sampleOutput: {
            columns: ["description", "amount", "risk_level"],
            values: [
                ["Consulting Fee - Offshore", 50000, "Critical"]
            ]
        },
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
        task: "Rank employees by salary within each department (highest salary ranked first). Select the employee name, department, salary, and their department salary rank aliased as 'salary_rank'.",
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
        task: "Calculate the running cumulative transaction sum over time. Select the transaction ID, amount, and the running sum aliased as 'cumulative_spent' ordered by the transaction date.",
        sampleOutput: {
            columns: ["id", "amount", "cumulative_spent"],
            values: [
                [1, 1000, 1000]
            ]
        },
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
        task: "Find the names of all employees who share the same manager as 'Alice Smith' (excluding 'Alice Smith' themselves).",
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
        task: "Find the offshore account numbers that received transfers routed through the country 'Bahamas'.",
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
        task: "Identify the departments whose budget is strictly greater than the average budget of all departments.",
        sampleOutput: {
            columns: ["name"],
            values: [
                ["Executive"]
            ]
        },
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
        task: "Flag the highly suspicious transaction of 45,000 on the ledger by updating its description to 'FLAGGED - SUSPICIOUS TRANSACTION' in the 'transactions' table.",
        sampleOutput: {
            columns: [],
            values: []
        },
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
        task: "Log a newly detected intruder threat by inserting the IP '192.168.1.99', risk level 'High', reason 'Data Exfiltration Signature', and detection time '2023-10-12 14:00:00' into the 'blacklisted_ips' table.",
        sampleOutput: {
            columns: [],
            values: []
        },
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
        task: "Identify the unique names of employees who have logged in with a status of 'Failed' from an IP address recorded in the blacklist.",
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
        task: "Perform a final sweep by purging all transfer logs associated with the bank 'Panama Secure Holdings'.",
        sampleOutput: {
            columns: [],
            values: []
        },
        validator: (_results, query) => {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('delete') && lowerQuery.includes('transfer_logs') && lowerQuery.includes('select') && lowerQuery.includes('panama')) {
                return { success: true, message: "Forensics complete! Panama accounts purged. All 50 levels of SQL Detective solved!" };
            }
            return { success: false, message: "Verify your DELETE condition subquery." };
        }
    }
];
