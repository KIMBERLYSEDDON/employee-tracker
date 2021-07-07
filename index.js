const mysql = require('mysql');
const inquirer = require('inquirer')

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'm30Wm!X#18',
  database: 'employeeDB',
});
const options = [
    {
        type: 'list',
        message: "What would you like to do?",
        name: 'menu',
        choices: [
            "View All Employees", 
            "View All Roles", 
            "View All Departments", 
            "Add Employee", 
            "Update Employee Role", 
            "Add Role", 
            "Add Department",
            "EXIT"
        ]
    }
]
const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      console.table(res);
      menuPrompt();
    });
};
const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
      console.table(res);
      menuPrompt();
    });
};
const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      console.table(res);
      menuPrompt();
    });
};

const addEmployee = () => {
    connection.query('SELECT * FROM department INNER JOIN role ON department.id = role.department_id', (err, data) => {
        if (err) throw err; 
    inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'What is the first name of this employee?',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'What is the last name of this employee?',
      },
      {
        name: 'role',
        type: 'rawlist',
        message: "What will this employee's role be?",
        choices() {
            const choiceArray = [];
            data.forEach(({ title, id }) => {
              choiceArray.push(`${title} ${id}`);
            });
            return choiceArray;
        }
      },
      {
        name: 'manager',
        type: 'input',
        message: "What is the manager's id for this employee if any?",
      }
  ])
    .then((response) => {
      let chosenRole = response.role.slice(-1)
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: response.first_name,
          last_name: response.last_name,
          role_id: parseInt(chosenRole),
          manager_id: response.manager || null,
        },
        (err) => {
          if (err) throw err;
          console.log('Your employee was added successfully!', response.role);
          menuPrompt();
        }
      );
    });
  })
}
const addRole = () => {
  connection.query('SELECT DISTINCT * FROM department', (err, data) => {
      if (err) throw err; 
  inquirer
  .prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the title of the new role?',
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What will the starting salary of this new role be?',
    },
    {
      name: 'department',
      type: 'rawlist',
      message: "Which department should this role be in?",
      choices() {
          const choiceArray = [];
          data.forEach(({ name, id }) => {
            // if (department_id === null){
            //   department_id = department_id.length + 1
            // }
            choiceArray.push(`${name} ${id}`);
          });
          return choiceArray;
      }
    },
])
  .then((response) => {
    let chosenRole = response.department.slice(-1)
    connection.query(
      'INSERT INTO role SET ?',
      {
        title: response.title,
        salary: parseInt(response.salary),
        department_id: parseInt(chosenRole)
      },
      (err) => {
        if (err) throw err;
        console.log('New role was added successfully!');
        menuPrompt();
      }
    );
  });
})
}
const addDepartment = () => {
  connection.query('SELECT * FROM department', (err, data) => {
      if (err) throw err; 
  inquirer
  .prompt([
    {
      name: 'name',
      type: 'input',
      message: 'What is the name of the new department?',
    }
])
  .then((response) => {
    connection.query(
      'INSERT INTO department SET ?',
      {
        name: response.name,
      },
      (err) => {
        if (err) throw err;
        console.log('New department was added successfully!');
        menuPrompt();
      }
    );
  });
})
};

const updateEmployee = () => {
  connection.query(
    'SELECT employee.id, first_name, last_name, role.id, title FROM employee RIGHT JOIN role ON employee.role_id = role.id', (err, data) => {
  inquirer
  .prompt([
    {
      name: 'employee',
      type: 'rawlist',
      message: "Which employee would you like to update?",
      choices() {
        const choiceArray = [];
        data.forEach(({id, first_name, last_name }) => {
          if (first_name && last_name !== null){
          choiceArray.push(`${id} ${first_name} ${last_name}`);
          }
        });
        return choiceArray;
    }
    },
    {
      name: 'newRole',
      type: 'rawlist',
      message: "Which new role would you like this employee to have?",
      choices() {
        const choiceArray = [];
        data.forEach(({title, id}) => {
          choiceArray.push(`${title} ${id}`);
        });
        return choiceArray;
    }
    }
  ])
  .then((response) => {
    let empId = response.employee.split(' ');
    let empRole = response.newRole.slice(-1);

    connection.query(
      'UPDATE employee SET ? WHERE ?',
      [
        {
          role_id: parseInt(empRole),
        },
        {
          last_name: empId[2],
        },
      ],
      (err) => {
        if (err) throw err;
        console.log('This employee was updated successfully!');
        menuPrompt();
      }
    );
  });
})
};

const menuPrompt = () => { 
    console.log("Welcome to the the Employee Tracker!");
    
    inquirer.prompt(options)
      .then((response) => {
          switch (response.menu) {
            case "View All Employees":
                viewEmployees()
                break;
            case "View All Roles":
                viewRoles()
                break;
            case "View All Departments":
                viewDepartments()
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "EXIT":
                connection.end();
                break;
            default:
                console.log("OH NOOOOO")
                break;
          }
      })
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    menuPrompt();
});
  