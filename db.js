const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'gmd.cyzu8qfumgjc.us-east-2.rds.amazonaws.com',
    user: 'majkellvz',
    password: 'Dejvi18.',
    database: 'gmd',
    port: '3306'
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;