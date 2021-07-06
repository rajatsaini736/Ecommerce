const express = require('express');
var router = express.Router();
const users = require('../app/controllers/users');

// ROLE 777 = ADMIN
// ROLE 555 = CUSTOMER

router.get('/', users.getAllUsers);

router.get('/:userId', users.getUser);

router.patch('/:userId', users.updateUser);

module.exports = router;
