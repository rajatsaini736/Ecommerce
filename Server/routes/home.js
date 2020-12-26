const express = require('express');
const router = express.Router();
const helper = require('../config/helpers')

router.get('/', [helper.validJWTNeeded], (req, res)=>{
    res.render('index');
});

module.exports = router;