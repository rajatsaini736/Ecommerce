const MySqli = require('mysqli');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// let conn = new MySqli({
//     host: '103.86.176.20',
//     post: 3306,
//     user: 'defenceguru_ae', 
//     passwd: 'rajatsaini736@',
//     charset: '',
//     db: 'defenceguru_angularecommerce' 
//   })

// let database = conn.emit(false, 'defenceguru_angularecommerce');

let conn = new MySqli({
    host: 'localhost', 
    post: 3306, 
    user: 'root', 
    passwd: 'rajatsaini', 
    charset: '', 
    db: 'angecommerce'  
  }) 
let database = conn.emit(false, 'angecommerce');


  const secret = "1SBz93MsqTs7KgwARcB0I0ihpILIjk3w";

  module.exports = {
    database: database,
    secret: secret,
    validJWTNeeded: (req, res, next) => {
      if (req.headers['authorization']){
        try{
          let authorization = req.headers['authorization'].split(' ');
          if( authorization[0] !== 'Bearer'){
            return res.status(401).send();
          } else{
            req.jwt = jwt.verify(authorization[1], secret);
            return next();
          }
        } catch(err){
          return res.status(403).send("Authentication faileds");
        }
      } else{
        return res.status(401).send("No authorization header found");
      }
    },
    hasAuthFields: (req, res, next) => {
      let errors = [];

      if (req.body) {
          if (!req.body.email) {
              errors.push('Missing email field');
          }
          if (!req.body.password) {
              errors.push('Missing password field');
          }

          if (errors.length) {
              return res.json({errors: errors.join(',')});
          } else {
              return next();
          }
      } else {
          return res.json({errors: 'Missing email and password fields'});
      }
  },
  isPasswordAndUserMatch: async (req, res, next) => {
    const myPlaintextPassword = req.body.password;
    const myEmail = req.body.email;          
          
    const user = await database.table('users').filter({$or:[{ email : myEmail },{ username : myEmail }]}).get();
    if (user) {
        const match = await bcrypt.compare(myPlaintextPassword, user.password);
        if (match) {
            req.username = user.username;
            req.email = user.email;
            req.userid = user.id;
            req.fname = user.fname;
            req.lname = user.lname;
            next();
        } else {
            res.json({ errors : "Email or password incorrect" });
        }
        
    } else {
        res.json({ errors : "Email incorrect"});
    }
}
};