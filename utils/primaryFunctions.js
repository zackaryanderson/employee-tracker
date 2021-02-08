const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zack98**',
    database: 'employee_tracker'
});

//get roles for selection
rolesList = [];
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
            let fullName = res.first_name.concat(res.last_name);
            managerList.push(fullName);
        }
    })
    return managerList
};

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
        'SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles INNER JOIN department ON roles.department_id = department.departmentId',
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
        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(m.first_name, ' ',m.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = departmentId LEFT JOIN employees m ON employees.manager_id = m.id",
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
    departmentList = [];
    db.query(
        'SELECT * FROM department',
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                departmentList.push(res[i].name);
            }
            departmentId = departmentList.indexOf(ans.department_name) + 1;
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
        }
    )
};

//add an employee
addAnEmployee = (ans) => { 
    let roleName = ans.role_name;
    let managerNameArr = ans.manager_name.split(' ');
    let managerName = managerNameArr[1];
    managerList = [];
    managerIdList = [];
    roleList = [];
    roleIdList = [];
    db.query(
        'SELECT employees.last_name, employees.id, roles.title, roles.id AS roles_id FROM employees JOIN roles',
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                managerList.push(res[i].last_name);
                managerIdList.push(res[i].id);
                roleList.push(res[i].title);
                roleIdList.push(res[i].roles_id);
            }
            let managerIdLoc = managerList.indexOf(managerName);
            let managerId = managerIdList[managerIdLoc];
            let roleIdLoc = roleList.indexOf(roleName);
            let roleId = roleIdList[roleIdLoc]; 
            console.log(roleId);
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
        }
    )
};

//update an employee
updateAnEmployeeRole = (ans) => { 
    let lastName = (ans.last_name);
    rolesList = [];
    db.query('SELECT * FROM roles',
        function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                rolesList.push(res[i].title);
            }
            newRole = rolesList.indexOf(ans.role_id) + 1;
            db.query(
                'UPDATE employees SET ? WHERE ?',
                [
                    {role_id: newRole},
                    {last_name: lastName}
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee's role updated!\n");
                    promptUser();
                }
            )
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