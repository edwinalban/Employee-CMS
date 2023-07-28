-- Delete Database if it already exists
DROP DATABASE IF EXISTS cms_db;

-- Create Database
CREATE DATABASE cms_db;

-- Select Database for use
USE cms_db;

-- Create the Departments table
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Create the Roles table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
);

-- Create the Employees table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT DEFAULT NULL REFERENCES employees (id) ON DELETE SET NULL,
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);