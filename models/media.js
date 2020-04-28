const sql = require("../db");

const Media = function (media) {
    this.image_path = media.image_path;
    this.product_id = media.product_id
};

Media.create = (newMedia) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO media SET ?", newMedia, (err, res) => {
            if (err) {
                console.log("error: ", err);
                // result(err, null);
                return reject(err);
            }

            console.log("created media: ", {id: res.id, ...newMedia});
            // result(null, {id: res.id, ...newMedia});
            return resolve(`Media u ngarkua me sukses!`);
        });
    })
};

Media.getByProduct = productId => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM media WHERE product_id = ?", productId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res);
        });
    })
};

Media.remove = (id, result) => {
    sql.query("DELETE FROM media WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows === 0) {
            result({kind: "not_found"}, null);
            return;
        }

        console.log("deleted media with id: ", id);
        result(null, res);
    });
};

Media.getByPath = imagePath => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT image_path FROM media WHERE image_path = ?", imagePath, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res[0]);
        });
    })
};

Media.getOneImageByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM media WHERE product_id = ?", productId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            resolve(res[0]);
        });
    }).catch(e => {
        console.log(e)
    })
};

module.exports = Media;