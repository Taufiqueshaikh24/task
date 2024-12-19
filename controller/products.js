const { response } = require('express');
const pool = require('../db');  

const getProducts = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        // res.status(200).json(rows);
        res.render('products'  , { products })
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};







const getProduct = async (req , res) => {
      try {
        let id = req.params.id ; 
        let query = `SELECT * FROM PRODUCTS WHERE ID = ?`
          const [rows] = await pool.query(query , [id])
          res.status(200).json(rows);
      } catch (error) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
}







const createProduct = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, price, description } = req.body;

        // Fetch category details
        const categoryQuery = 'SELECT name FROM categories WHERE id = ?';
        const [category] = await pool.query(categoryQuery, [categoryId]);

        if (category.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const categoryName = category[0].name;

        const query = 'INSERT INTO products (name, categoryId, price, description) VALUES (?, ?, ?, ?)';
        await pool.query(query, [name, categoryId, price, description]);

        res.redirect(`/products/category/${categoryId}`);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};











const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const { categoryId } = req.query;

        // Debug logs
        console.log('Product ID:', id);
        console.log('Name:', name);
        console.log('Price:', price);
        console.log('Description:', description);
        console.log('Category ID:', categoryId);

        // Update product query
        const updateQuery = 'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?';
        await pool.query(updateQuery, [name, price, description, id]);

        // Check if the category exists
        const categoryQuery = 'SELECT id, name FROM categories WHERE id = ?';
        const [category] = await pool.query(categoryQuery, [categoryId]);

        if (category.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const categoryName = category[0].name;
        // Correct URL redirection
        res.redirect(`/products/category/${categoryId}?categoryName=${encodeURIComponent(categoryName)}`);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};




const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId } = req.query;

        console.log('Product ID:', id);
        console.log('Category ID:', categoryId);

        // Check if the product exists
        const productQuery = 'SELECT * FROM products WHERE id = ?';
        const [product] = await pool.query(productQuery, [id]);

        if (product.length === 0) {
            console.log('Product not found');
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the product
        const deleteQuery = 'DELETE FROM products WHERE id = ?';
        await pool.query(deleteQuery, [id]);

        // Check if the category exists
        const categoryQuery = 'SELECT id, name FROM categories WHERE id = ?';
        const [category] = await pool.query(categoryQuery, [categoryId]);

        if (category.length === 0) {
            console.log('Category not found');
            return res.status(404).json({ error: 'Category not found' });
        }

        // Redirect back to the category's product list
        res.redirect(`/products/category/${categoryId}`);
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};







const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch category details
        const categoryQuery = 'SELECT name FROM categories WHERE id = ?';
        const [category] = await pool.query(categoryQuery, [categoryId]);

        if (category.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const categoryName = category[0].name;

        const productQuery = `
            SELECT 
                p.id, p.name, p.categoryId, c.name as categoryName, p.price, p.description 
            FROM 
                products p
            JOIN
                categories c ON p.categoryId = c.id
            WHERE 
                p.categoryId = ? 
            LIMIT ? OFFSET ?
        `;
        const [products] = await pool.query(productQuery, [categoryId, limit, offset]);

        const countQuery = 'SELECT COUNT(*) as total FROM products WHERE categoryId = ?';
        const [countResult] = await pool.query(countQuery, [categoryId]);
        const totalProducts = countResult[0].total;

        res.render('products', { products, categoryName, categoryId, total: totalProducts, page, limit });
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const showUpdateProductForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId } = req.query;

        // Fetch product details
        const productQuery = 'SELECT * FROM products WHERE id = ?';
        const [product] = await pool.query(productQuery, [id]);

        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productDetails = product[0];

        res.render('updateProduct', { product: productDetails, categoryId });
    } catch (err) {
        console.error('Error fetching product for update:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};






module.exports = { getProducts , getProduct , createProduct , updateProduct ,showUpdateProductForm , deleteProduct , getProductsByCategory};
