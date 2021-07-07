INSERT INTO department (name)
VALUES ("Managment"), ("Engineering"), ("Sales"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 60000, 1), ("Engineer", 75000, 2), ("Sales Lead", 55000, 3), ("Salesperson", 45000, 3), ("Jr. Developer", 65000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Smith", 1), ("Karen", "Jones", 3), ("Suzie", "Q", 2), ("Mikey", "Chan", 2);