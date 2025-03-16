\c departments_db;

INSERT INTO department (name)
VALUES ('Engineering'),
       ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');


INSERT INTO role (title, salary, department_id)
VALUES ('Sr. Engineer', 100000, 1),
       ('Jr. Engineer', 80000, 1),
       ('Accountant', 75000, 2),
       ('Lawyer', 120000, 3),
       ('Salesperson', 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 1),
       ('Jane', 'Doe', 2, 1),
       ('Alice', 'Johnson', 3, 2),
       ('Bob', 'Smith', 4, 3),
       ('Charlie', 'Brown', 5, 4);

