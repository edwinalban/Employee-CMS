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
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.index) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
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

function viewEmployees() {
    const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, '', managers.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.log('\nEmployees:\n');
        console.table(results);
        promptUser();
    });
};

