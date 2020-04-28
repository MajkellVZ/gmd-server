const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

const Admin = require('../../models/admin');

router.get('/', auth, async (req, res) => {
    let admin = await Admin.findById(req.user.id);
    await res.send(admin);
});

//login
router.post('/', [
    check('email', 'Kerkohet Email').isEmail(),
    check('password', 'Kerkohet Password').exists()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    let admin = await Admin.findAllByEmail(email);
    if (!admin) {
        return res.status(400).json({errors: [{msg: 'Admini nuk ekziston'}]});
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        return res.status(400).json({errors: [{msg: 'Kredenciale invalide.'}]});
    }

    const payload = {
        user: {
            id: admin.id
        }
    };

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 360000},
        (err, token) => {
            if (err) throw err;
            res.json({token});
        });
});

module.exports = router;