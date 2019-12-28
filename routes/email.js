const express = require('express');
const router = express.Router();

const {confirmPurchase} = require('../controllers/email');



router.post('/email/confirm', confirmPurchase);

module.exports = router;