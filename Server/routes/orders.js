const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const orders = require('../app/controllers/orders');

// GET ALL ORDERS
router.get('/', orders.getAllOrders);

// GET SINGLE ORDERS
router.get('/:id', orders.getOrder);

// PLACE A NEW ORDER
router.post('/new', orders.addOrder);

//FAKE PAYMENT GATEWAY CALL
router.post('/payment', orders.orderPayment);

module.exports = router;