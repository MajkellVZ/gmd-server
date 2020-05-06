const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Orders = require('../../models/orders');

router.post('/', [
    check('product_id', 'Kerkohet Produkti').not().isEmpty(),
    check('full_name', 'Kerkohet Emri i plote').not().isEmpty(),
    check('email', 'Kerkohet Email').not().isEmpty(),
    check('email', 'Formati i Email nuk eshte i duhuri').isEmail(),
    check('phone', 'Kerkohet Numeri i Telefonit').not().isEmpty(),
    check('address', 'Kerkohet Adresa').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {product_id, full_name, email, phone, address} = req.body;

    var response = null;

    for (var product of product_id) {
        if (product.quantity == 0 || product.quantity == null || product.quantity == '') {
            return res.status(400).json({errors: [{msg: 'Mungon Sasia e Produktit: ' + product.product_name}]});
        }

        let order = new Orders({
            product_id: product.id,
            quantity: product.quantity,
            full_name: full_name,
            email: email,
            phone: phone,
            address: address
        });

        order = await Orders.create(order);

        response = order
    }

    await res.send(response);
});

router.get('/', auth, async (req, res) => {
    const page = req.query.page || 1;
    const limit = 10;
    const total = await Orders.count();
    const total_pages = Math.ceil(total / limit);

    const orders = await Orders.getAll(page);
    await res.send({page, total, total_pages, orders});
});

router.get('/:id', auth, async (req, res) => {
    const {id} = req.params;
    const orders = await Orders.getById(id);
    await res.send(orders);
});

router.put('/:id', [auth, [
    check('product_id', {id: '5', text: 'Product Required'}).not().isEmpty(),
    check('quantity', {id: '7', text: 'Quantity Required'}).not().isEmpty(),
    check('full_name', {id: '8', text: 'Full Name Required'}).not().isEmpty(),
    check('email', {id: '9', text: 'Email Required'}).not().isEmpty(),
    check('email', {id: '9', text: 'Email Required'}).isEmail(),
    check('phone', {id: '10', text: 'Category Required'}).not().isEmpty(),
    check('address', {id: '10', text: 'Address Required'}).not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {id} = req.params;
    const {product_id, quantity, full_name, email, phone, address} = req.body;

    let order = new Orders({
        product_id: product_id,
        quantity: quantity,
        full_name: full_name,
        email: email,
        phone: phone,
        address: address
    });

    order = await Orders.update(id, order);
    await res.send(order);
});

router.delete('/:id', auth, async (req, res) => {
    const {id} = req.params;
    const orders = await Orders.remove(id);
    await res.send(orders);
});

module.exports = router;