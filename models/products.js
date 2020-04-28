const sql = require("../db");

const Products = function (products) {
    this.name = products.name;
    this.description = products.description;
    this.price = products.price;
    this.quantity = products.quantity;
    this.category = products.category;
    this.isImportant = products.isImportant;
};

Products.create = (newProduct, result) => {
    sql.query("INSERT INTO products SET ?", newProduct, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created customer: ", {id: res.id, ...newProduct});
        result(null, {id: res.id, ...newProduct});
    });
};

Products.findById = (productId, result) => {
    sql.query(`SELECT * FROM products WHERE id = ${productId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found products: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({kind: "not_found"}, null);
    });
};

Products.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM products`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    });
};

Products.getAllByPage = (page) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM products LIMIT ?,10`, (parseInt(page) - 1) * 10, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    });
};

Products.update = (id, product, result) => {
    sql.query(
        "UPDATE products SET name = ?, description = ?, quantity = ?, price = ?, category = ? WHERE id = ?",
        [product.name, product.description, product.quantity, product.price, product.category, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows === 0) {
                result({kind: "not_found"}, null);
                return;
            }

            console.log("updated product: ", {id: id, ...product});
            result(null, {id: id, ...product});
        }
    );
};

Products.remove = (id, result) => {
    sql.query("DELETE FROM products WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows === 0) {
            result({kind: "not_found"}, null);
            return;
        }

        console.log("deleted product with id: ", id);
        result(null, res);
    });
};

Products.count = (search_term) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT COUNT(id) AS count FROM products where name like CONCAT('%',?,'%')", search_term, (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res[0].count);
        });
    })
};

Products.filter = (search_term, page) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM products where name like CONCAT('%',?,'%') LIMIT ?,10", [search_term, (parseInt(page) - 1) * 10], (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res);
        })
    })
};

Products.findByName = (productName) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM products WHERE name = ?', productName, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res[0])
        })
    });
};

Products.getByID = (productId) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM products WHERE id = ?', productId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res[0])
        })
    });
};

Products.findByCategory = (category) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM products WHERE category = ?`, category, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    });
};

Products.getImportant = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM products WHERE isImportant = 1 LIMIT 3`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    });
};

Products.makeImportant = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`UPDATE products SET isImportant = 1 where id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve("Produkti u kthye i rendesishem")
        })
    });
};

Products.makeUnimportant = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`UPDATE products SET isImportant = 0 where id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve("Produkti nuk eshte me i rendesishem")
        })
    });
};

Products.findByNameAndCategory = (name, category) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM products WHERE name like CONCAT('%',?,'%') and category like CONCAT('%',?,'%')", [name, category], (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res)
        })
    });
};

module.exports = Products;