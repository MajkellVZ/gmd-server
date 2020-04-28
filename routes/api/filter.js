const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Products = require('../../models/products');
const Orders = require('../../models/orders');

router.get('/', auth, async (req, res) => {
    const {search_term} = req.query;

    const page = req.query.page || 1;
    const limit = 10;
    const total = await Products.count(search_term);
    const total_pages = Math.ceil(total/limit);

    const products = await Products.filter(search_term, page);
    res.send({page, total, total_pages, products});
});

router.get('/category/:category', async (req, res) => {
    const {category} = req.params;

    const data = await Products.findByCategory(category);
    await res.send({data: data});
});

router.get('/important', async (req, res) => {
    const products = await Products.getImportant();
    await res.send(products)
});

router.get('/orders', async (req, res) => {
    const {search_term} = req.query;
    const page = req.query.page || 1;
    const limit = 10;
    const total = await Orders.count(search_term);
    const total_pages = Math.ceil(total/limit);

    const orders = await Orders.getByNameEmailNumber(search_term, page);
    await res.send({page, total, total_pages, orders});
});

router.get('/name/category/', async (req, res) => {
    const {name, category} = req.query;
    const products = await Products.findByNameAndCategory(name, category);
    await res.send({data: products});
});

module.exports = router;