const express = require('express');

const upload = require('../middleware/multer');
const convertCtrl = require('../controllers/fileConvert');

const router = express.Router();

router.post('/convert', upload, convertCtrl.createPDF);

router.get('/convert/:id', convertCtrl.getPDFs);

module.exports = router;