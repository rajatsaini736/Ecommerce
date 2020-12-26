const e = require('express');
var express = require('express');
var router = express.Router();
const {database} = require('../config/helpers');

// ROLE 777 = ADMIN
// ROLE 555 = CUSTOMER


router.get('/', (req, res) => {
  database.table('users')
    .withFields(
    ['username', 'email', 'fname', 'lname', 'id','role']
    )
    .getAll()
    .then((list) =>{
      if(list.length > 0){
        res.json({users: list});
      } else{
        res.json({message: 'NO USER FOUND'});
      }
    }).catch(err => res.json(err));
});

router.get('/:userId', (req, res) =>{
  let userId = req.params.userId;
  database.table('users').filter({id: userId})
    .withFields([
      'username', 'email', 'fname', 'lname', 'role', 'id'
    ])
    .get().then(user => {
      if(user){
        res.json({user});
      } else{
        res.json({message: ` NO USER FOUND WITH ID : ${userId}`});
      }
    }).catch(err => res.json(err));
});

// UPDATE USER DATA
router.patch('/:userId', async(req, res) =>{
  let userId = req.params.userId;

  let user = await database.table('users').filter({id: userId}).get();
  if(user){
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    let userFirstName = req.body.fname;
    let userLastName = req.body.lname;
    let userUsername = req.body.username;

    // replace the user's info with the form data ( keep the data as is if no info is modified)

    database.table('users').filter({id: userId})
      .update({
        email: userEmail !== undefined ? userEmail : user.email,
        password: userPassword !== undefined ? userPassword : user.password,
        username: userUsername !== undefined ? userUsername : user.username,
        fname: userFirstName !== undefined ? userFirstName : user.fname,
        lname: userLastName !== undefined ? userLastName : user.lname,
      })
      .then(result => res.json('User updated successfully')).catch(err => res.json(err));
  }
});


module.exports = router;
