const express = require('express');
const router = express.Router();

const {listSearch,productDeatils} = require('../controllers/mercari');


router.get('/mercari/search', listSearch);
router.get('/mercari/product', productDeatils);


module.exports = router;

