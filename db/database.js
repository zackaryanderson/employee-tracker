const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//create connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zack98**',
    database: 'employee_tracker'
});

//connect to the database and start the program
db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId + '\n');
    promptUser()
});

//prompt the user with a list of options to choose from
promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'openingList',
            message: 'Welcome to Employee Tracker \n What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Quit']
        }
    ]).then(res => userResponseHandler(res));
};

userResponseHandler = (res) => {
    console.log(res.openingList);
    const userResponse = res.openingList;

    //Api calls based upon user response
    if (userResponse === "View All Departments") {
        viewAllDepartments();
    }
    if (userResponse === "View All Roles") {
        viewAllRoles();
    }
    if (userResponse === "View All Employees") {
        viewAllEmployees();
    }
    if (userResponse === "Add A Department") {
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Please enter the department name.'
            }
        ]).then(ans => addADepartment(ans));
    }
    if (userResponse === "Add A Role") {
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Please enter the role title.'
            },
            {
                type: 'input',
                name: 'salary',
                message: "Please enter the role's salary."
            },
            {
                type: 'input',
                name: 'department_id',
                message: "Please enter the role's department id."
            },
        ]).then(ans => addARole(ans));
    }
    if (userResponse === "Add An Employee") {
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Please enter the employee's first name."
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Please enter the employee's last name."
            },
            {
                type: 'input',
                name: 'role_id',
                message: "Please enter the employee's role id."
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "Please enter the employee's manager id."
            }
        ]).then(ans => addAnEmployee(ans));
    }
    if (userResponse === "Update An Employee Role") {
        inquirer.prompt([
            {
                type: 'input',
                name: 'employee_id',
                message: "Please enter the employee's id."
            },
            {
                type: 'input',
                name: 'employee_role',
                message: "Please enter the employee's updated role."
            }
        ]).then(ans => updateAnEmployeeRole(ans));
    }
    if (userResponse === "Quit") {
        db.end()
    }
};

//view all departments
viewAllDepartments = () => {
    console.log("Viewing all departments");
    db.query(
        'SELECT * FROM department',
        function (err, res) {
            if (err) throw err;
            console.table(res);
        }
    )
    db.end();
};

//view all roles
viewAllRoles = () => {
    console.log("Viewing all roles");
    db.query(
        'SELECT * FROM roles',
        function (err, res) {
            if (err) throw err;
            console.table(res);
        }
    )
    db.end();
};

//view all employees
viewAllEmployees = () => {
    console.log("Viewing all employees");
    db.query(
        'SELECT * FROM employees',
        function (err, res) {
            if (err) throw err;
            console.table(res);
        }
    )
    db.end();
};

//add a department
addADepartment = (ans) => {
    db.query(
        'INSERT INTO department SET ?',
        ans,
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' department added!\n');
        }
    )
    db.end();
};

//add a role
addARole = (ans) => { 
    let salary = parseInt(ans.salary);
    let departmentId = parseInt(ans.department_id);
    db.query(
        'INSERT INTO roles SET ?',
        {
            title: ans.title,
            salary: salary,
            department_id: departmentId
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' role added!\n');
        }
    )
    db.end();
};

//add an employee
addAnEmployee = (ans) => { 
    let roleId = ans.role_id;
    let managerId = ans.manager_id;
    db.query(
        'INSERT INTO employees SET ?',
        {
            first_name: ans.first_name,
            last_name: ans.last_name,
            role_id: roleId,
            manager_id: managerId
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' employee added!\n');
        }
    )
    db.end();
};

//update an employee
updateAnEmployeeRole = (ans) => { 
    let employeeId = parseInt(ans.employee_id);
    let newRole = parseInt(ans.employee_role);
    db.query(
        'UPDATE employees SET ? WHERE ?',
        [
            {role_id: newRole},
            {id: employeeId}
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee's role updated!\n");
        }
    )
    db.end();
};

quit = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'return',
            message: 'Go Back To Main Menu?',
            default: false
        }
    ])
        .then(ans => {
            if (ans.return) {
                promptUser();
            } else {
                console.log("Goodbye");
                db.end();
            }
        });
};


module.exports = db;