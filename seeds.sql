USE employeeDB;

INSERT INTO department
    (id, name)
VALUES
    (1, "Managment"),
    (2, "Engineering"),
    (3, "Sales"),
    (4, "Marketing"),
    (5, "Q&A");

INSERT INTO role
    (id, title, salary, department_id)
VALUES
    (1, "CEO", 150000, 1),
    (2, "product Manager", 110000, 1),
    (3, "Senior Engineer", 100000, 2),
    (4, "Junior Engineer", 75000, 2),
    (5, "Sales Lead", 70000, 3),
    (6, "Creative Director", 90000, 4 ),
    (7, "Social Media Manager", 95000, 1),
    (8, "Chief Quality Tester", 90000, 1),
    (9, "Tester", 70000, 2);

INSERT INTO employee
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, "Jason", "Debrek", 1),
    (2, "Jenifer", "Shmidt", 1),
    (3, "Mark", "Zark", 2),
    (4, "Melisa", "Saber", 2),
    (5, "Wendy", "Paye", 3),
    (6, "Josh", "Franklin", 4),
    (7, "Will", "Manderaz", 4),
    (8, "Mary", "Tamer", 1),
    (9, "Mike", "Wilson", 2);