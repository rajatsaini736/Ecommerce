const express = require('express');
const router = express.Router();
const {database}  = require('../config/helpers');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) =>{
    callback(null, 'uploads')
  },
  filename: (req, file, callback) =>{
    callback(null, `${file.originalname}`)
  }
})
let upload = multer({ storage: storage});
// let upload = multer({dest: 'uploads/'});

//UPLOAD AN IMAGE
router.post('/upload', upload.single('file'), (req, res) =>{
  const file = req.file;
  if(!file){
    res.status(500).json({
      message: "No files here.",
      status: "failed"
    })
  }else{
    res.status(200).json({
      message: "Image uploaded",
      status: "success"
    })
  } 
})

//UPLOAD IMAGES
router.post('/upload-files', upload.array('files'), (req, res) =>{
  const files = req.files;
  if(!files){
    res.status(500).json({
      message: "No files here.",
      status: "failed"
    })
  }else{
    res.status(200).json({
      message: "Images uploaded",
      status: "success"
    })
  } 
})

//ADD NEW PRODUCT
router.post('/add', (req, res) => {
  let {productCatId, productTitle, productDescription, productQuantity, productImage, productImages, productShortDesc, productPrice } = req.body;

  // console.log(productCatId, productTitle, productDescription, productQuantity, proudctImage, productImages, productShortDesc, productPrice);

  // if(!isNaN(productCatId) && 
  // productTitle != null && productTitle != undefined && 
  // productDescription != undefined && productDescription != null && 
  // !isNaN(productQuantity) && 
  // productImage != undefined && productImage != null &&
  // !isNaN(productPrice)
  //  ){
    database
      .table('products')
      .insert({
        cat_id : productCatId,
        title : productTitle,
        description : productDescription,
        quantity : productQuantity,
        image : productImage,
        images : productImages,
        short_desc : productShortDesc,
        price : productPrice
        })
      .then((newProdId) => {
        if(newProdId){
          res.status(200).json({
            message: `Product successfully created with product id ${newProdId}`,
            status: "success"
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "failed to insert the product",
          status: "failure"
        });
      })
  // } else{
  //   console.log("not working");
  //   res.status(500).json({
  //     message: "Please enter valid details",
  //     status: "failure"
  //   });
  // }
});



/* GET All Products. */
router.get('/', function(req, res) {
  let page = (req.query.page != undefined && req.query.page != 0 ) ? req.query.page : 1; // set the current page number
  const limit = (req.query.limit != undefined && req.query.limit != 0 ) ? req.query.limit : 10; // set the limit of items per page

  let startValue;
  let endValue;

  if(page>0){
    startValue = (page * limit) - limit;  //0,10,20
    endValue = (page * limit);           //9,19,29
  } else{
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
    .join([{
      table: 'category as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([ 'c.title as category',
      'p.title as name',
      'p.description',
      'p.id',
      'p.image',
      'p.short_desc',
      'p.price',
      'p.quantity'
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prod => {
      if(prod.length>0){
        res.status(200).json({
          count: prod.length,
          products: prod
        });
      } else{
        res.json({message: 'No products found'});
      }
    }).catch(err => console.log(err));

});

// GET SINGLE PRODUCT.
router.get('/:prodId', (req,res)=>{

  let productId = req.params.prodId;

  database.table('products as p')
    .join([{
      table: 'category as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([ 'c.title as category',
    'p.title as name',
    'p.description',
    'p.id',
    'p.image',
    'p.images',
    'p.short_desc',
    'p.price',
    'p.quantity'
    ])
    .filter({'p.id': productId})
    .get()
    .then(prod => {
      if(prod){
        res.status(200).json(prod);
      } else{
        res.json({message: `No product found with product ID  ${productId}`});
      }
    }).catch(err => console.log(err));

});

//GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY.
router.get('/category/:catName', (req,res)=>{
  const cat_title = req.params.catName;
  let page = (req.query.page != undefined && req.query.page != 0 ) ? req.query.page : 1; // set the current page number
  const limit = (req.query.limit != undefined && req.query.page != 0 ) ? req.query.limit : 10; // set the limit of items per page

  let startValue;
  let endValue;

  if(page>0){
    startValue = (page * limit) - limit;  //0,10,20
    endValue = (page * limit);           //9,19,29
  } else{
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
    .join([{
      table: 'category as c',
      on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
    }])
    .withFields([ 'c.title as category',
    'p.title as name',
    'p.description',
    'p.id',
    'p.image',
    'p.short_desc',
    'p.price',
    'p.quantity'
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prod => {
      if(prod.length>0){
        res.status(200).json({
          count: prod.length,
          products: prod
        });
      } else{
        res.json({message: `No products found from ${cat_title} category`});
      }
    }).catch(err => console.log(err));
});

//DELETE A PRODUCT
router.delete('/delete/:id', (req, res) => {
  const prodId = req.params.id;

  if(!isNaN(prodId)){
    database
    .table("products")
    .filter({'id': prodId})
    .remove()
    .then((successNum) => {
      if(successNum == 1){
        res.status(200).json({
          message: `Record deleted with product id ${prodId}`,
          status: "success"
        });
      } else{
        res.status(500).json({
          status: "failure",
          message: 'Cannot delete the product'
        });
      }
    }).catch((err) => {
      res.status(500).json(err);
    });
  } else{
    res.status(500).json({message: "Id is not a valid number", status: "failure"});
  }

});
module.exports = router;
