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
    db.end();
});

module.exports = db;