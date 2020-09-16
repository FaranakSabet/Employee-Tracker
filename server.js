const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const clear = require("console-clear");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Myyear2020",
  database: "employeesdb",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  appStart();
});

appStart = () => {
  clear();
  welcomeScreen();
  menuPrompt();
};

welcomeScreen = () => {
  console.log("Welcome to Employee Database System\n");
};

renderScreen = (tableTitle, tableData) => {
  clear();
  welcomeScreen();
  console.log(tableTitle);
  console.table(tableData);
  menuPrompt();
};

menuPrompt = () => {
  inquirer
    .prompt({
      type: "list",
      name: "promptChoice",
      message: "Pick an option:",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "View Roles",
        "View Departments",
        "Add Employee",
        "Add Roles",
        "Add Departments",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Update Employee Role",
        "Update Employee Manager",
        "View Total Utilized Budget By Department",
        "Exit Program",
      ],
    })
    .then((answer) => {
      switch (answer.promptChoice) {
        case "View All Employees":
          searchAllEmployees();
          break;

        case "View All Employees by Department":
          queryDepartments();
          break;

        case "View All Employees by Manager":
          queryManagers();
          break;

        case "View Roles":
          queryRolesOnly();
          break;

        case "View Departments":
          queryDepartmentsOnly();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Roles":
          addRole();
          break;

        case "Add Departments":
          deptAdd();
          break;

        case "Remove Employee":
          employeeRemove();
          break;

        case "Remove Role":
          roleRemove();
          break;

        case "Remove Department":
          deptRemove();
          break;

        case "Update Employee Role":
          employeeRoleUpdate();
          break;

        case "Update Employee Manager":
          employeeManagerUpdate();
          break;

        case "View Total Utilized Budget By Department":
          totalBudgetSearch();
          break;

        case "Exit Program":
          clear();
          process.exit();
      }
    });
};

askDepartments = (departments) => {
  inquirer
    .prompt({
      type: "list",
      name: "promptChoice",
      message: "Select Department:",
      choices: departments,
    })
    .then((answer) => {
      queryEmployeesByDepartment(answer.promptChoice);
    });
};

askManagers = (managers) => {
  inquirer
    .prompt({
      type: "list",
      name: "promptChoice",
      message: "Select Manager:",
      choices: managers,
    })
    .then((answer) => {
      queryEmployeesByManager(answer.promptChoice);
    });
};
