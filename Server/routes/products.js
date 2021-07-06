const express = require('express');
const router = express.Router();
const products = require('../app/controllers/products');
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
router.post('/upload', upload.single('file'), products.uploadImage);

//UPLOAD IMAGES
router.post('/upload-files', upload.array('files'), products.uploadImages);

//ADD NEW PRODUCT
router.post('/add', products.addProduct);

/* GET All Products. */
router.get('/', products.getAllProducts);

// GET SINGLE PRODUCT.
router.get('/:prodId', products.getProduct);

//GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY.
router.get('/category/:catName', products.getAllProductFromCategory);

//DELETE A PRODUCT
router.delete('/delete/:id', products.deleteProduct);

module.exports = router;
