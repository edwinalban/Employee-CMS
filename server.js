// Imports mysql, console table, and 
const mysql = require('mysql2');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

// Creates a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '7NM35BeF3ortbQ$2',
    database: 'cms_db'
});

// Connects to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Successfully connected to the cms_db database.');
    promptUser();
});

// Function to display the main menu and handle user choices
function promptUser() {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: 'What would you like to do?',
            choices: [
                `View all departments`,
                `View all roles`,
                `View all employees`,
                `Add a department`,
                `Add a role`,
                `Add an employee`,
                `Update an employee's role`,
                `Exit`,
            ],
        })
        .then((answer) => {
            switch (answer.index) {
                case `View all departments`:
                    viewDepartments();
                    break;
                case `View all roles`:
                    viewRoles();
                    break;
                case `View all employees`:
                    viewEmployees();
                    break;
                case `Add a department`:
                    addDepartment();
                    break;
                case `Add a role`:
                    addRole();
                    break;
                case `Add an employee`:
                    addEmployee();
                    break;
                case `Update an employee's role`:
                    updateEmployeeRole();
                    break;
                case `Exit`:
                    db.end();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
                    promptUser();
            };
        });
};

// Function to view all departments
function viewDepartments() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        console.log('\nDepartments:\n');
        console.table(results);
        promptUser();
    });
};

// Function to view all roles
function viewRoles() {
    // Join the roles table with the departments table to display the department name for each role
    const query = `
      SELECT roles.id, roles.title, roles.salary, departments.name AS department
      FROM roles
      INNER JOIN departments ON roles.department_id = departments.id
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.log('\nRoles:\n');
        console.table(results);
        promptUser();
    });
};

// Function to view all Employees
function viewEmployees() {
    const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.log('\nEmployees:\n');
        console.table(results);
        promptUser();
    });
};

// Function to add a deparment
function addDepartment() {
    inquirer
        .prompt([{
            type: 'input',
            name: 'addDepartment',
            message: 'What is the name of the Department you would like to add?',
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log(`
                    Please enter a department name.`);
                    return false;
                }
            }
        }])
        .then((answer) => {
            const query = `INSERT INTO departments (name) Values (?)`;
            db.query(query, answer.addDepartment, (err, result) => {
                if (err) throw err;
                console.log(`Successfully added ${answer.addDepartment} to departments!`);

                viewDepartments();
            });
        });
};

// Function to add a role
function addRole() {
    const query = `SELECT * FROM departments`;

    db.query(query, (err, data) => {
        if (err) throw err;

        const departments = data.map(({ id, name }) => ({ name: name, value: id }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'What is the title of this role:',
                    validate: roleName => {
                        if (roleName) {
                            return true;
                        } else {
                            console.log(`
                            Please enter a title for the role.`);
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Please enter a number (no commas) for the salary for this role:',
                    validate: roleSalary => {
                        if (roleSalary === '') {
                            console.log(`
                            Please enter a number (no commas) for the salary for this role:'`);
                            return false;
                        } else if (isNaN(roleSalary)) {
                            console.log(`
                            Please enter a number (no commas) for the salary for this role:'`);
                            roleSalary.value = '';
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What is the department for this role:',
                    choices: departments
                }
            ])
            .then((answers) => {
                const query = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`

                const userInputs = [];
                userInputs.push(answers.roleName, answers.roleSalary, answers.department);

                db.query(query, userInputs, (err, result) => {
                    if (err) throw err;
                    console.log(`Successfully added ${answers.roleName} to roles!`);
                    viewRoles();
                });
            });
    });
};

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: `What is the employee's first name?`,
                validate: firstName => {
                    if (firstName) {
                        return true;
                    } else {
                        console.log(`
                        Please enter the first name of the employee.`);
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: `What is the employee's last name?`,
                validate: lastName => {
                    if (lastName) {
                        return true;
                    } else {
                        console.log(`
                        Please enter the last name of the employee.`);
                        return false;
                    }
                }
            }
        ])
        .then(answers => {
            const entries = [];
            entries.push(answers.firstName, answers.lastName);

            const rolesQuery = `SELECT roles.id, roles.title FROM roles`;

            db.query(rolesQuery, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }))

                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Please select a role for the employee.',
                            choices: roles
                        }
                    ])
                    .then(answer => {
                        entries.push(answer.role)

                        const managerQuery = `SELECT id, first_name, last_name FROM employees`;

                        db.query(managerQuery, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: (first_name + ' ' + last_name), value: id }));
                            managers.push({ name: 'None', value: null });
                            console.log(managers);

                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: 'Please select a manager for the employee.',
                                        choices: managers
                                    }
                                ])
                                .then((answer) => {
                                    entries.push(answer.manager);

                                    const query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) Values (?, ?, ?, ?)"
                                    db.query(query, entries, (err, result) => {
                                        if (err) throw err;
                                        console.log(`Successfully added ${entries[0]} ${entries[1]} to employees!`)
                                        viewEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

function updateEmployeeRole() {
    const allQuery = `SELECT * FROM employees`;

    db.query(allQuery, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: (first_name + ' ' + last_name), value: id }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeName',
                    message: `Please select which employee's role you would like to update. `,
                    choices: employees
                }
            ])
            .then(answer => {
                const employee = answer.employeeName;
                const chosenEmployee = [];
                chosenEmployee.push(employee);

                const allRolesQuery = `SELECT * FROM roles`;

                db.query(allRolesQuery, (err, data) => {
                    if (err) throw err;

                    const allRoles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer
                        .prompt(
                            {
                                type: 'list',
                                name: 'role',
                                message: `Please select the employee's new role`,
                                choices: allRoles
                            }
                        )
                        .then(answer => {
                            const newRole = answer.role;
                            chosenEmployee.push(newRole);

                            console.log(chosenEmployee);

                            let currentRole = chosenEmployee[0]
                            chosenEmployee[0] = newRole;
                            chosenEmployee[1] = currentRole;

                            console.log(chosenEmployee);

                            const updateQuery = `UPDATE employees SET role_id = ? WHERE id = ?`;

                            db.query(updateQuery, chosenEmployee, (err, result) => {
                                if (err) throw err;
                                console.log(`Successfully updated employee's role!`);

                                viewEmployees();
                            });
                        });
                });
            });
    });
};