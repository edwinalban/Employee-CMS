const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
// const prompts = require('./')

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
    user: 'root',
    password: '7NM35BeF3ortbQ$2',
    database: 'cms_db',
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
  startApp();
});

// Function to display the main menu and handle user choices
function startApp() {
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
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
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
          startApp();
      }
    });
}
// Function to view all departments
function viewAllDepartments() {
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    console.log('\nDepartments:\n');
    console.table(results);
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
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
      startApp();
    });
  }

