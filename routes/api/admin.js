const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const Admin = require('../../models/admin');

//register
router.post('/', [
    check('email', 'Kerkohet Email').isEmail(),
    check('password', 'Krijoni password me 6 ose me shume karaktere').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    let admin = await Admin.findByEmail(email);
    if (admin) {
        return res.status(400).json({errors: [{msg: 'Admini ekziston'}]});
    }

    admin = new Admin({
        email: email,
        password: password
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await Admin.register(admin, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Admin."
            });
        else res.send(data);
    })
});

module.exports = router;