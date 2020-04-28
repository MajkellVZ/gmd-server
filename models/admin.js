const sql = require("../db");
const jwt = require('jsonwebtoken');
const config = require('config');

const Admin = function(admin) {
    this.email = admin.email;
    this.password = admin.password;
};

Admin.register = (newAdmin, result) => {
    sql.query("INSERT INTO admin SET ?", newAdmin, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        const payload = {
            admin: {
                id: newAdmin.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if (err) throw err;
                console.log("created admin: ", {id: res.id, ...newAdmin});
                result(null, {token});
            });


    });
};

Admin.findByEmail = (adminEmail) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT email FROM admin WHERE email = ?', adminEmail, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res[0])
        })
    });
};

Admin.findAllByEmail = (adminEmail) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM admin WHERE email = ?', adminEmail, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res[0])
        })
    });
};

Admin.findById = (adminId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT email FROM admin WHERE id = ?`, adminId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res[0])
        })
    });
};

module.exports = Admin;