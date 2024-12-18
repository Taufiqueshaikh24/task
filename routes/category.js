const express = require('express'); 
const { addCategory, getCategories, deleteCategoryAndProducts ,  getProductsByCategory, updateCategory,  } = require('../controller/category');
const router = express.Router(); 

router.route('/').get(getCategories).post(addCategory)
router.route('/:id').put(updateCategory).delete(deleteCategoryAndProducts);
router.route('/:id/products').get(getProductsByCategory);
module.exports = router ; 