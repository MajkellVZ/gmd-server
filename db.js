// const mysql = require("mysql");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'db-mysql-nyc3-05703-do-user-7438322-0.a.db.ondigitalocean.com',
    user: 'doadmin',
    password: 'fogq7x2apn3wd1ki',
    database: 'defaultdb',
    port: '25060'
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;