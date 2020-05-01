const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

const app = express();

const uploads = path.join(__dirname,'../../uploads');
app.use(express.static(uploads));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Media = require('../../models/media');
const Products = require('../../models/products');

router.post('/:id', auth, upload.array('photos', 100), async (req, res) => {
    const {id} = req.params;
    const product = await Products.getByID(id);
    if (!product) return res.status(400).json({errors: [{msg: 'Produkti nuk ekziston'}]});

    const files = req.files;
    if (!files) return res.status(400).json({errors: [{msg: 'Dokumenti nuk ekziston'}]});

    var response = [];

    for (var file of files) {

        try {
            const media = new Media({
                image_path: file.originalname,
                product_id: id
            });

            const mediaRes = await Media.create(media);
            await response.push(mediaRes);
        } catch (err) {
            console.log(err.message);
            await response.push(err.message);
        }
    }

    await res.json(response);
});

router.get('/product/:id', async (req, res) => {
    const {id} = req.params;

    const media = await Media.getByProduct(id);

    await res.send(media)
});

router.get('/:path', async (req, res) => {
    const {path} = req.params;

    const media = await Media.getByPath(path);
    if (!media) {
        return res.status(400).json({msg: 'Media not found'});
    }

    await res.sendFile(`${uploads}/${path}`);
});

router.delete('/:id', auth, async (req, res) => {
    const {id} = req.params;

    await Media.remove(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Media with id ${id}.`, type: 'danger'
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Media with id " + id, type: 'danger'
                });
            }
        } else res.send({message: `Media u fshi me sukses!`, type: 'success'});
    });
});

router.get('/single_image/product/:id', async (req, res) => {
    const {id} = req.params;

    const media = await Media.getOneImageByProductId(id);

    await res.send(media)
});

module.exports = router;