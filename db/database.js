const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addADepartment, addARole, addAnEmployee, updateAnEmployeeRole, quit } = require('../utils/primaryFunctions');

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

//get roles for selection
let rolesList = [];
function getRoles () {
    rolesList = [];
    db.query('SELECT * FROM roles',
        function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                rolesList.push(res[i].title);
            }
        }
    )
    return rolesList;
}

//get managers for selection
let managerList = [];
function getManagers () {
    managerList = [];
    db.query('SELECT first_name, last_name FROM employees WHERE manager_id IS NULL',
    function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            let fullName = res[i].first_name.concat(' ',res[i].last_name);
            managerList.push(fullName);
        }
        managerList.push('NULL');
    })
    return managerList
};

userResponseHandler = (res) => {
    const userResponse = res.openingList;

    //switch containing all possible responses
    switch (userResponse) {
        case 'View All Departments':
            viewAllDepartments();
            break;

        case 'View All Roles':
            viewAllRoles();
            break;

        case 'View All Employees':
            viewAllEmployees();
            break;

        //add a department
        case 'Add A Department':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Please enter the department name.'
                }
            ]).then(ans => addADepartment(ans))
            break;

        //add a role
        case 'Add A Role':
            db.query("SELECT department.name FROM department",
                function (err, res) {
                    if (err) throw err;
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
                            type: 'list',
                            name: 'department_name',
                            choices: function () {
                                var departmentName = [];
                                for (var i = 0; i < res.length; i++) {
                                    departmentName.push(res[i].name);
                                }
                                return departmentName
                            },
                            message: "Please select the roles department."
                        },
                    ]).then(ans => addARole(ans));
                })
                    break;

        //add an employee
        case 'Add An Employee':
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
                    type: 'list',
                    name: 'role_name',
                    choices: getRoles(),
                    message: "Please select the employee's role."
                },
                {
                    type: 'list',
                    name: 'manager_name',
                    choices: getManagers(),
                    message: "Please select the employee's manager."
                }
            ]).then(ans => addAnEmployee(ans));
            break;

        // update an employee role
        case 'Update An Employee Role':
            db.query("SELECT last_name FROM employees",
                function (err, res) {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'last_name',
                            choices: function () {
                                var employeeName = [];
                                for (var i = 0; i < res.length; i++) {
                                    employeeName.push(res[i].last_name);
                                }
                                return employeeName
                            },
                            message: "Please select the employee you wish to update."
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            choices: getRoles(),
                            message: "Please enter the employee's updated role."
                        }
                    ]).then(ans => updateAnEmployeeRole(ans));
                });
            break;

        default:
            console.log("Goodbye");
            db.end();
    }
}


module.exports = {
    db, 
    getRoles,
    getManagers
};