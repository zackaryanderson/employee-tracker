const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zack98**',
    database: 'employee_tracker'
});

//view all departments
viewAllDepartments = () => {
    console.log("Viewing all departments");
    db.query(
        'SELECT * FROM department',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    )
};

//view all roles
viewAllRoles = () => {
    console.log("Viewing all roles");
    db.query(
        'SELECT * FROM roles',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    )
};

//view all employees
viewAllEmployees = () => {
    console.log("Viewing all employees");
    db.query(
        'SELECT * FROM employees',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    )
};

//add a department
addADepartment = (ans) => {
    db.query(
        'INSERT INTO department SET ?',
        ans,
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' department added!\n');
            promptUser();
        }
    )
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
            promptUser();
        }
    )
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
            promptUser();
        }
    )
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
            promptUser();
        }
    )
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

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addADepartment,
    addARole,
    addAnEmployee,
    updateAnEmployeeRole,
    quit
}