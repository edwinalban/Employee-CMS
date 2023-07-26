INSERT INTO departments (name)
VALUES ("Engineering"),
       ("Customer Success"),
       ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Engineer I", "50000.00", 1),
       ("Customer Service I", "30000.00", 2),
       ("Sales I", "60000.00", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Jane", "Doe", 2, NULL),
       ("Edwin", "Alban", 3, NULL);


