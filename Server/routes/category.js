const e = require('express');
var express = require('express');
var router = express.Router();
const {database} = require('../config/helpers');


// GET all category 
router.get('/', function(req, res) {
  
  database.table('category as u')
    .withFields([
        'u.id as id',
      'u.title as title',
      'u.description as description'
    ])
    .getAll()
    .then( cats => {
      if(cats.length>0){
        res.status(200).json({
          count: cats.length,
          categories: cats
        });
      } else{
        res.json({message: 'No category found'});
      }
    }).catch(err=>console.log(err));

});

router.post('/add', (req, res) => {
    let {catTitle, catDescription} = req.body;
    if(catTitle != null && catTitle != undefined && catDescription != null && catDescription != undefined){
        database
            .table('category')
            .insert({
                title : catTitle,
                description : catDescription
            }).then((newCatId) => {
                res.status(200).json({
                    message: `Category inserted with category id ${newCatId}`,
                    status: "success"
                });
            }).catch((err) => {
                res.status(500).json({
                    message: 'Category not inserted',
                    status: "failure"
                });
            })
    }else{
        res.status(200).json({
            message: 'Please enter category title and descripiton correctly',
            status: 'failure'
        });
    }
});

router.delete('/delete/:id', (req, res) =>{
    const catId = req.params.id;  
    if(!isNaN(catId)){
        console.log(catId);  
        database.table("category")
            .filter({'id': catId})
            .remove()
            .then((successNum) =>{
                if( successNum == 1){
                    res.status(200).json({
                        message: `Record deleted with category id ${catId}`,
                        status: "success"
                    });
                }else{
                    res.status(500).json({
                        message: "Cannot delete the product",
                        status: "failure"
                    });
                }
            }).catch((err) => {
                res.status(500).json(err);
            });
    } else{
        console.log("not");
        res.status(500).json({message: "Id is not a valid number", status: "failure"});
    }
});

module.exports = router;