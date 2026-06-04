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
            // For update, results array might be empty, we just need to check the query for now
            // A better way would be to run a select to verify, but for simple validation:
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('update employees') && lowerQuery.includes("set role") && lowerQuery.includes("suspended")) {
                 return { success: true, message: "Account suspended! You saved OmniCorp." };
            }
            return { success: false, message: "Make sure you UPDATE employees SET role = 'Suspended' WHERE name = 'Eve Davis';" };
        }
    }
];
