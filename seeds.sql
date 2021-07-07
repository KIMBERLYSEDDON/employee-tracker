INSERT INTO department (name)
VALUES ("Managment"), ("Engineering"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 60000), ("Engineer", 75000), ("Sales Lead", 55000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith"), ("Karen", "Jones");