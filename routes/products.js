const express = require('express'); 
const router = express.Router(); 
const { getProducts , getProduct, getProductsByCategory ,  createProduct, updateProduct, deleteProduct} = require('../controller/products');

// router.route('/:categoryId').get(getProducts).post(createProduct)
// router.route('/:categoryId').get(getProductsByCategory).post(createProduct)
router.route('/category/:categoryId').get(getProductsByCategory).post(createProduct)
router.route('/').get(getProducts);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);
// router.route('/by-category').get(getProductsByCategory);


module.exports = router ; 