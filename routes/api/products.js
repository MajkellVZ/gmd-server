const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Products = require('../../models/products');

router.post('/', [auth, [
    check('name', 'Kerkohet Emri').not().isEmpty(),
    check('description', 'Kerkohet Pershkrimi').not().isEmpty(),
    check('price', 'Kerkohet Çmimi').not().isEmpty(),
    check('quantity', 'Kerkohet Sasia').not().isEmpty(),
    check('category', 'Kerkohet Kategoria').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, description, price, quantity, category} = req.body;

    let product = await Products.findByName(name);
    if (product) {
        return res.status(400).json({errors: [{msg: 'Produkti ekziston'}]});
    }

    product = new Products({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        category: category,
        isImportant: 0
    });

    await Products.create(product, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product."
            });
        else res.json('Produkti u shtua');
    })
});

router.get('/', async (req, res) => {
    const products = await Products.getAll();
    res.send({data: products})
});

router.get('/admin', auth, async (req, res) => {
    const search_term = "";

    const page = req.query.page || 1;
    const limit = 10;
    const total = await Products.count(search_term);
    const total_pages = Math.ceil(total / limit);

    const products = await Products.getAllByPage(page);
    res.send({page, total, total_pages, products})
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    await Products.findById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Products with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Products with id " + id
                });
            }
        } else res.send(data);
    });
});

router.put('/:id', [auth, [
    check('name', 'Kerkohet Emri').not().isEmpty(),
    check('description', 'Kerkohet Pershkrimi').not().isEmpty(),
    check('price', 'Kerkohet Çmimi').not().isEmpty(),
    check('quantity', 'Kerkohet Sasia').not().isEmpty(),
    check('category', 'Kerkohet Kategoria').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, description, price, quantity, category} = req.body;
    const {id} = req.params;

    let product = await Products.findByName(name);
    if (product && id !== product.id.toString()) {
        return res.status(400).json({errors: [{msg: 'Emri Produktit i perdorur'}]});
    }

    product = new Products({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        category: category,
    });

    await Products.update(
        id,
        product,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Product with id ${id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Product with id " + id
                    });
                }
            } else res.json('Produkti u modifikua');
        }
    );
});

router.delete('/:id', auth, async (req, res) => {
    const {id} = req.params;

    await Products.remove(id, (err) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Product with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Product with id " + id
                });
            }
        } else res.json('Produkti u fshi');
    });
});

router.put('/important/:id', auth, async (req, res) => {
    const {id} = req.params;

    const products = await Products.makeImportant(id);
    await res.send(products);
});

router.put('/unimportant/:id', auth, async (req, res) => {
    const {id} = req.params;

    const products = await Products.makeUnimportant(id);
    await res.send(products);
});

module.exports = router;