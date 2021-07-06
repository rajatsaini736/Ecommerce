const { database } = require('../../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {

    userLogin: (req, res, next) => {
        let token = jwt.sign({state: 'true', email: req.body.email, username: req.body.username}, helper.secret, {
            algorithm: 'HS512',
            expiresIn: '7d'
        });
        res.json({token: token, auth: true, email: req.email, name: req.username, id: req.userid, fname: req.fname, lname: req.lname});
    },

    userRegister: async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({errors: errors.array()});
        } else{
            let email = req.body.email;
            let username = email.split("@")[0];
            let password = await bcrypt.hash(req.body.password, 10);
            let fname = req.body.fname;
            let lname = req.body.lname;
    
            // ROLE 777 - ADMIN
            // ROLE 555 - CUSTOMER
    
            helper.database.table('users').insert({
                username: username,
                password: password,
                email: email,
                role: 555,
                lname: lname || null,
                fname: fname || null
            }).then(lastId => {
                if (lastId > 0){
                    res.json({auth: true, email: email, username: username, id: lastId, fname: fname, lname: lname});
                } else{
                    res.json({message: 'Registration failded'});
                }
            }).catch(err => res.json({error: err}));
        }
    }

}