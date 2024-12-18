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



// const getProductsByCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.params;
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = (page - 1) * limit;

//         const query = `
//             SELECT p.id AS productId, p.name AS productName, c.name AS categoryName, p.categoryId, p.price, p.description 
//             FROM products p 
//             JOIN categories c ON p.categoryId = c.id 
//             WHERE p.categoryId = ? 
//             LIMIT ? OFFSET ?
//         `;
//         const [products] = await pool.query(query, [categoryId, limit, offset]);

//         const countQuery = 'SELECT COUNT(*) as total FROM products WHERE categoryId = ?';
//         const [countResult] = await pool.query(countQuery, [categoryId]);
//         const totalProducts = countResult[0].total;

//         res.render('products', {
//             products,
//             categoryId,
//             total: totalProducts,
//             page,
//             limit
//         });
//         // res.status(200).json({
            
//         //         categoryId,
//         //         total: totalProducts,
//         //         page,
//         //         limit,
//         //         products
//         // })
//     } catch (err) {
//         console.error('Error fetching products:', err);
//         res.status(500).send('Internal server error');
//     }
// };




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
        const { name, categoryId, price, description } = req.body;

        // Check if categoryId exists
        const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
        if (category.length === 0 || categoryId > category.length || categoryId < category.length) {
            return res.status(400).json({ error: 'Category not found' });
        }

        // Insert product
        const query = `INSERT INTO products (name, categoryId, price, description) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.query(query, [name, categoryId, price, description]);

        // Fetch the inserted product using the insertId
        const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

        res.status(200).json(product[0]);
    } catch (err) {
        console.error('Error inserting product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId, price, description } = req.body;

        // Initialize an array to hold the parts of the update query
        let updates = [];
        let values = [];

        // Check each field and add to the updates array if it exists in the request body
        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name);
        }
        if (categoryId !== undefined) {
            updates.push('categoryId = ?');
            values.push(categoryId);
        }
        if (price !== undefined) {
            updates.push('price = ?');
            values.push(price);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }

        // If there are no updates, return early
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        // Add the id to the values array for the WHERE clause
        values.push(id);

        // Construct the final update query
        let query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Fetch the updated product details
        const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        res.status(200).json(product[0]);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, categoryId, price, description } = req.body;
        
//         let query = `UPDATE products SET name = ?, categoryId = ?, price = ?, description = ? WHERE id = ?`;
//         const [result] = await pool.query(query, [name, categoryId, price, description, id]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         // Fetch the updated product details
//         const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
//         res.status(200).json(product[0]);
//     } catch (err) {
//         console.error('Error updating product:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }




const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        let query = `DELETE FROM products WHERE id = ?`;
        const [result] = await pool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}



// const getProductsByCategory = async (req, res) => {
//     try {
//         const query = `
//             SELECT 
//                 categories.id AS categoryId, 
//                 categories.name AS categoryName, 
//                 products.id AS productId, 
//                 products.name AS productName, 
//                 products.price, 
//                 products.description 
//             FROM products 
//             JOIN categories ON products.categoryId = categories.id 
//             ORDER BY categories.name, products.name;
//         `;
//         const [rows] = await pool.query(query);

//         // Organize data by category
//         const result = rows.reduce((acc, row) => {
//             const { categoryId, categoryName, productId, productName, price, description } = row;

//             if (!acc[categoryName]) {
//                 acc[categoryName] = {
//                     categoryId,
//                     categoryName,
//                     products: []
//                 };
//             }

//             acc[categoryName].products.push({
//                 productId,
//                 productName,
//                 price,
//                 description
//             });

//             return acc;
//         }, {});

//         res.status(200).json(result);
//     } catch (err) {
//         console.error('Error fetching products by category:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };




// const getProductsByCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.params; // Extract categoryId from params
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = (page - 1) * limit;

//         const query = `
//             SELECT 
//                 p.id, p.name, p.categoryId, c.name as categoryName, p.price, p.description 
//             FROM 
//                 products p
//             JOIN
//                 categories c ON p.categoryId = c.id
//             WHERE 
//                 p.categoryId = ? 
//             LIMIT ? OFFSET ?
//         `;
//         const [products] = await pool.query(query, [categoryId, limit, offset]);

//         const countQuery = 'SELECT COUNT(*) as total FROM products WHERE categoryId = ?';
//         const [countResult] = await pool.query(countQuery, [categoryId]);
//         const totalProducts = countResult[0].total;

//         res.render('products', { products, categoryId, total: totalProducts, page, limit }); // Pass categoryId
//     } catch (err) {
//         console.error('Error fetching products by category:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };




const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
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
        const [products] = await pool.query(query, [categoryId, limit, offset]);

        const countQuery = 'SELECT COUNT(*) as total FROM products WHERE categoryId = ?';
        const [countResult] = await pool.query(countQuery, [categoryId]);
        const totalProducts = countResult[0].total;

        res.render('products', { products, categoryId, total: totalProducts, page, limit });
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};





module.exports = { getProducts , getProduct , createProduct , updateProduct , deleteProduct , getProductsByCategory};
