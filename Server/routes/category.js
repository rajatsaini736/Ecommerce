var express = require('express');
var router = express.Router();
const category = require('../app/controllers/category');

// GET all category 
router.get('/', category.getAllCategory);

router.post('/add', category.addCategory);

router.delete('/delete/:id', category.deleteCategory);

module.exports = router;