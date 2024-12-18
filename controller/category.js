const pool = require('../db');


const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        let query = `INSERT INTO categories (name) VALUES (?)`;
        const [result] = await pool.query(query, [name]);

        // Fetch the inserted category using the insertId
        const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

        // res.status(201).json(category[0]);
        res.redirect('/categories');
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories');
        res.render('categories', { categories });
        // res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        let query = `UPDATE categories SET name = ? WHERE id = ?`;
        const [result] = await pool.query(query, [name, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        // res.status(200).json(category[0]);
        // res.redirect('/categories');
        res.redirect('/categories');
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// const deleteCategory = async (req, res) => {
//     try {
//         const { id } = req.params;

//         let query = `DELETE FROM categories WHERE id = ?`;
//         const [result] = await pool.query(query, [id]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Category not found' });
//         }

//         res.status(200).json({ message: 'Category deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting category:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }




const deleteCategoryAndProducts = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;

        await connection.beginTransaction();

        // Delete products associated with the category
        const deleteProductsQuery = 'DELETE FROM products WHERE categoryId = ?';
        await connection.query(deleteProductsQuery, [id]);

        // Delete the category
        const deleteCategoryQuery = 'DELETE FROM categories WHERE id = ?';
        const [result] = await connection.query(deleteCategoryQuery, [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Category not found' });
        }

        await connection.commit();
        // res.status(200).json({ message: 'Category and associated products deleted successfully' });
        res.redirect('/categories');
    } catch (err) {
        await connection.rollback();
        console.error('Error deleting category and products:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
}





// const getProductsByCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.params;
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = (page - 1) * limit;

//         const query = `
//             SELECT 
//                 * 
//             FROM 
//                 products 
//             WHERE 
//                 categoryId = ? 
//             LIMIT ? OFFSET ?
//         `;
//         const [products] = await pool.query(query, [categoryId, limit, offset]);

//         const countQuery = 'SELECT COUNT(*) as total FROM products WHERE categoryId = ?';
//         const [countResult] = await pool.query(countQuery, [categoryId]);
//         const totalProducts = countResult[0].total;
        
//         // res.status(200).json({
//         //     total: totalProducts,
//         //     page: page,
//         //     limit: limit,
//         //     productCount: products.length,
//         //     products: products,
//         // });
//         res.render('products', { products, categoryId: id });
//     } catch (err) {
//         console.error('Error fetching products by category:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }



const getProductsByCategory = async (req, res) => {
    try {
        const { id: categoryId } = req.params; // Extract categoryId from params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                * 
            FROM 
                products 
            WHERE 
                categoryId = ? 
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








module.exports = { addCategory, getCategories, getProductsByCategory ,  deleteCategoryAndProducts ,  updateCategory };
