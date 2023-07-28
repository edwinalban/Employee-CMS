-- Add name values to deparments table 
INSERT INTO departments (name)
VALUES ("Engineering"),
       ("Customer Success"),
       ("Sales");

-- Add title, salary, and department id values to roles table
INSERT INTO roles (title, salary, department_id)
VALUES ("Engineer I", "50000.00", 1),
       ("Customer Service I", "30000.00", 2),
       ("Sales I", "60000.00", 3);

-- Add first name, last name, id, manager id values to employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Jane", "Doe", 2, NULL),
       ("Edwin", "Alban", 3, NULL);


