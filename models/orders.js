const sql = require("../db");

const Orders = function (orders) {
    this.product_id = orders.product_id;
    this.quantity = orders.quantity;
    this.full_name = orders.full_name;
    this.email = orders.email;
    this.phone = orders.phone;
    this.address = orders.address;
};

Orders.create = (newOrder) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO orders SET ?", newOrder, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve("Blerja u krye me sukses!")
        })
    }).catch(e => {
        console.log(e)
    })
};

Orders.getAll = (page) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT orders.id, products.name, orders.quantity, orders.full_name, orders.email, orders.phone, orders.address FROM orders" +
            " INNER JOIN products ON orders.product_id = products.id ORDER BY orders.id DESC LIMIT ?,10", [(parseInt(page) - 1) * 10],(err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    })
};

Orders.getById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM orders where id = ?", id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    })
};

Orders.update = (id, order) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE orders SET product_id = ?, quantity = ?, full_name = ?, email = ?, phone = ?, address = ? where id = ?",
            [order.product_id, order.quantity, order.full_name, order.email, order.phone, order.address, id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return reject(err);
                }
                resolve("Order Updated")
            })
    })
};

Orders.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM orders where id = ?", id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve("Porosia u eliminua")
        })
    })
};

Orders.getByNameEmailNumber = (search_term, page) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT orders.id, products.name, orders.quantity, orders.full_name, orders.email, orders.phone, orders.address " +
            "FROM orders INNER JOIN products ON orders.product_id = products.id" +
            " where full_name like CONCAT('%',?,'%') or email like CONCAT('%',?,'%') or phone like CONCAT('%',?,'%') ORDER BY orders.id DESC LIMIT ?,10", [search_term, search_term, search_term, (parseInt(page) - 1) * 10], (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    })
};

Orders.count = (search_term = '') => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT COUNT(id) AS count FROM orders where full_name like CONCAT('%',?,'%') or email like CONCAT('%',?,'%') or phone like CONCAT('%',?,'%') ORDER BY orders.id DESC", [search_term, search_term, search_term], (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res[0].count);
        });
    })
};

module.exports = Orders;