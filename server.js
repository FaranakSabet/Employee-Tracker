const inquirer = require("inquirer"),
  mysql = require("mysql"),
  cTable = require("console.table"),
  clear = require("console-clear");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Myyear2020",
  database: "employeesdb",
});

connection.connect((err) => {
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
      type: 'list',
      name: 'promptChoice',
      message: 'Pick an option:',
      choices: [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager',
        'View Roles',
        'View Departments',
        'Add Employee',
        'Add Roles',
        'Add Departments',
        'Remove Employee',
        'Remove Role',
        'Remove Department',
        'Update Employee Role',
        'Update Employee Manager',
        'View Total Utilized Budget By Department',
        'Exit Program'
      ]
    })

.then((answer) => {
      switch (answer.promptChoice) {
        case 'View All Employees':
          searchAllEmployees()
          break

        case 'View All Employees by Department':
          queryDepartments()
          break

        case 'View All Employees by Manager':
          queryManagers()
          break

        case 'View Roles':
          queryRolesOnly()
          break

        case 'View Departments':
          queryDepartmentsOnly()
          break

        case 'Add Employee':
          addEmployee()
          break

        case 'Add Roles':
          addRole()
          break

        case 'Add Departments':
          deptAdd()
          break

        case 'Remove Employee':
          employeeRemove()
          break

        case 'Remove Role':
          roleRemove()
          break

        case 'Remove Department':
          deptRemove()
          break

        case 'Update Employee Role':
          employeeRoleUpdate()
          break

        case 'Update Employee Manager':
          employeeManagerUpdate()
          break

        case 'View Total Utilized Budget By Department':
          totalBudgetSearch()
          break

        case 'Exit Program':
          clear()
          process.exit()
      }
    })

    askDepartments = (departments) => {
      inquirer
        .prompt({
          type: 'list',
          name: 'promptChoice',
          message: 'Select Department:',
          choices: departments
        })
        .then((answer) => {
          queryEmployeesByDepartment(answer.promptChoice)
        })
    }
    
    askManagers = (managers) => {
      inquirer
        .prompt({
          type: 'list',
          name: 'promptChoice',
          message: 'Select Manager:',
          choices: managers
        })
        .then((answer) => {
          queryEmployeesByManager(answer.promptChoice)
        })
      }
      searchAllEmployees = () => {
        const query = `
          SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
          FROM employee 
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON department.id = role.department_id
        LEFT JOIN employee as manager ON employee.manager_id = manager.id;`
        connection.query(query, (err, res) => {
          if (err) throw err
      
          renderScreen(
            'All Employees',
            res.map((r) => ({
              ID: r.id,
              'First Name': r.first_name,
              'Last Name': r.last_name,
              Role: r.title,
              Salary: r.salary,
              Department: r.department_name,
              Manager: r.manager_full_name
            }))
          )
        })
      }
      
      queryDepartments = () => {
        const query = `SELECT department.name FROM department;`
        connection.query(query, (err, res) => {
          if (err) throw err
      
          askDepartments(res.map((dept) => dept.name))
        })
      }
      
      queryDepartmentsCallBack = (callback) => {
        const query = `SELECT department.name FROM department;`
        connection.query(query, (err, res) => {
          if (err) throw err
          callback(res.map((r) => r.name))
        })
      }
      
      queryDepartmentsOnly = () => {
        const query = `SELECT id, department.name FROM department;`
        connection.query(query, (err, res) => {
          if (err) throw err
          renderScreen(
            `All Departments`,
            res.map((r) => ({ ID: r.id, Departments: r.name }))
          )
        })
      }
      
      queryRolesOnly = () => {
        const query = `SELECT id, title FROM employeesdb.role;`
        connection.query(query, (err, res) => {
          if (err) throw err
          renderScreen(
            'All Roles',
            res.map((r) => ({ ID: r.id, Roles: r.title }))
          )
        })
      }

    queryManagers = () => {
  const query = `
    SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name
    FROM employee
    LEFT JOIN employee AS manager ON manager.id = employee.manager_id;`
  connection.query(query, (err, res) => {
    if (err) throw err
    askManagers(res.map((r) => r.full_name))
  })
}

queryEmployeesByDepartment = (department) => {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN employee AS manager ON employee.manager_id = manager.id
    INNER JOIN department ON department.id = role.department_id
    WHERE department.name = "${department}";`
  connection.query(query, (err, res) => {
    if (err) throw err

    renderScreen(
      `${department} Department`,
      res.map((r) => ({
        ID: r.id,
        'First Name': r.first_name,
        'Last Name': r.last_name,
        Role: r.title,
        Salary: r.salary,
        Manager: r.manager_full_name
      }))
    )
  })
  
}


queryEmployeesByManager = (manager) => {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name 
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN employee AS manager ON employee.manager_id = manager.id
    INNER JOIN department ON department.id = role.department_id
    WHERE concat(manager.first_name, " ", manager.last_name) = "${manager}";`
  connection.query(query, (err, res) => {
    if (err) throw err
    renderScreen(
      `Employees managed by ${manager}`,
      res.map((r) => ({
        ID: r.id,
        'First Name': r.first_name,
        'Last Name': r.last_name,
        Role: r.title,
        Salary: r.salary,
        Department: r.department_name
      }))
    )
  })
}
addEmployee = () => {
  const tempEmp = {
    firstName: '',
    lastName: '',
    roleID: 0,
    managerID: 0
  }
  inquirer
    .prompt([
      {
        name: 'firstName',
        message: 'Enter first name: ',
        validate: async (input) => {
          if (!input.match(/^[A-Z][A-Z ]{0,}/i)) {
            return "Sorry, the employee's first name must contain at least 1 character and must only contain letters and spaces!"
              .yellow
          }
          return true
        }
      },
      {
        name: 'lastName',
        message: 'Enter last name: ',
        validate: async (input) => {
          if (!input.match(/^[A-Z][A-Z ]{0,}/i)) {
            return "Sorry, the employee's last name must contain at least 1 character and must only contain letters and spaces!"
              .yellow
          }
          return true
        }
      }
    ])
    .then((answers) => {
      tempEmp.firstName = answers.firstName
      tempEmp.lastName = answers.lastName

      const query = `SELECT role.title, role.id FROM role;`
      connection.query(query, (err, res) => {
        if (err) throw err

        const roles = []
        const rolesNames = []
        for (let i = 0; i < res.length; i++) {
          roles.push({
            id: res[i].id,
            title: res[i].title
          })
          rolesNames.push(res[i].title)
        }

        inquirer
          .prompt({
            type: 'list',
            name: 'rolePromptChoice',
            message: 'Select Role:',
            choices: rolesNames
          })
          .then((answer) => {
            const chosenRole = answer.rolePromptChoice
            let chosenRoleID
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].title === chosenRole) {
                chosenRoleID = roles[i].id
              }
            }
            tempEmp.roleID = chosenRoleID
            const query = `
                    SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name, manager.id
                    FROM employee
                    LEFT JOIN employee AS manager ON manager.id = employee.manager_id;`
            connection.query(query, (err, res) => {
              if (err) throw err

              const managers = []
              const managersNames = []
              for (let i = 0; i < res.length; i++) {
                managersNames.push(res[i].full_name)
                managers.push({
                  id: res[i].id,
                  fullName: res[i].full_name
                })
              }

              inquirer
                .prompt({
                  type: 'list',
                  name: 'managerPromptChoice',
                  message: 'Select Manager:',
                  choices: managersNames
                })

.then((answer) => {
                  const chosenManager = answer.managerPromptChoice
                  let chosenManagerID
                  for (let i = 0; i < managers.length; i++) {
                    if (managers[i].fullName === chosenManager) {
                      chosenManagerID = managers[i].id
                      break
                    }
                  }

                  tempEmp.managerID = chosenManagerID

                  const query = 'INSERT INTO employee SET ?'
                  connection.query(
                    query,
                    {
                      first_name: tempEmp.firstName,
                      last_name: tempEmp.lastName,
                      role_id: tempEmp.roleID || 0,
                      manager_id: tempEmp.managerID || 0
                    },
                    (err, res) => {
                      if (err) throw err
                      console.log('Employee Added')

                      setTimeout(searchAllEmployees, 500)
                    }
                  )
                })
            })
          })
      })
    })
  }
  
  deptAdd = () => {
    inquirer
      .prompt([
        {
          name: 'dName',
          type: 'input',
          message: 'Enter new Department title:',
          validate: async function confirmStringInput(input) {
            if (input.trim() != '' && input.trim().length <= 30) {
              return true
            }
            return 'Invalid input. Please limit your input to 30 characters or less.'
          }
        }
      ])
      .then((answer) => {
        const query = `INSERT INTO department (name) VALUES (?);`
        connection.query(query, [answer.dName], (err, res) => {
          if (err) throw err
          console.log('  New Department added successfully!')
          queryDepartmentsCallBack(function (departments) {
            renderScreen('departments', departments)
          })
        })
      })
  }
  
  addRole = () => {
    const departments = []
    const departmentsName = []
  
    const query = `SELECT id, name FROM department`
    connection.query(query, (err, res) => {
      if (err) throw err
      for (let i = 0; i < res.length; i++) {
        departments.push({
          id: res[i].id,
          name: res[i].name
        })
        departmentsName.push(res[i].name)
      }
      inquirer
        .prompt([
          {
            name: 'rName',
            type: 'input',
            message: 'Enter new role title:',
            validate: async function confirmStringInput(input) {
              if (input.trim() != '' && input.trim().length <= 30) {
                return true
              }
              return 'Invalid input. Please limit your input to 30 characters or less.'
            }
          },
          {
            

          