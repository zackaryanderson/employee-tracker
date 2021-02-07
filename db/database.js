const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zack98**',
    database: 'employee_tracker'
});

db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId + '\n');
    promptUser();
});

promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'openingList',
            message: 'Welcome to Employee Tracker \n What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role']
        }
    ]);
    db.end();
};

module.exports = db;