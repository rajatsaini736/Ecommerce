const express = require('express');
const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../app/controllers/auth');

//LOGIN ROUTE
router.post('/login', [helper.hasAuthFields, helper.isPasswordAndUserMatch], user.userLogin);

// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Email field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),
    check('password').escape().trim().not().isEmpty().withMessage('Password field can\'t be empty')
        .isLength({min: 6}).withMessage("Password must be 6 characters long"),
    body('email').custom(value => {
        return helper.database.table('users').filter({
            $or:
                [
                    {email: value}, {username: value.split("@")[0]}
                ]
        }).get().then(user =>{
            if(user) {
                return Promise.reject('Email / Username already exists, choose another one');
            }
        })
    })
], user.userRegister);

module.exports = router;