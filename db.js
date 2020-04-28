// const mysql = require("mysql");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'gmd.cyzu8qfumgjc.us-east-2.rds.amazonaws.com',
    user: 'majkellvz',
    password: 'Dejvi18.',
    database: 'gmd',
    connectTimeout: 20000
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;