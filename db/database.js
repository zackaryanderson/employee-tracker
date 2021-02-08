const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const {viewAllDepartments,viewAllRoles,viewAllEmployees,addADepartment,addARole,addAnEmployee,updateAnEmployeeRole,quit} = require('../utils/primaryFunctions');

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

        case 'Add A Department':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Please enter the department name.'
                }
            ]).then(ans => addADepartment(ans))
            break;

        case 'Add A Role':
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
            break;

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
            break;
        case 'Update An Employee Role':
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
            break;

        case 'Quit':
            db.end();
            break;
    }
}


module.exports = db;