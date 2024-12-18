const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.MY_HOST,
    user: process.env.MY_USERNAME,
    password: process.env.MYPASSWORD,
    database: process.env.MY_DATABASE
}).promise();


 async function getProducts(){
    const [rows] = await pool.query("Select * from products");
    return rows;
}


 async function getProduc(id){
    const [rows] = await pool.query(`
           select * from products where id = ? 
        ` , [id])

    return rows;
}

//  getProduc(4)
 async function createProducts(name, ctgid, price, desc) {
    try {
        const [result] = await pool.query(
            `INSERT INTO products (name, categoryId, price, description)
            VALUES (?, ?, ?, ?)`,
            [name, ctgid, price, desc]
        );

        // Fetch the inserted product details
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        return rows[0];  // Return the first (and only) row
    } catch (err) {
        console.error('Error inserting product:', err);
    }
}


 async function Log() {
    const product = await createProducts("channu", 2, 1000, "channu chacha ki book");
    
    if (product) {
        console.log(`
            id: ${product.id},
            cid: ${product.categoryId},
            price: ${product.price},
            desc: ${product.description}
        `);
    }
}


module.exports = {
    getProduc,getProducts,
}

// getProducts();

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//         return;
//     }
//     console.log('Connected to the database as id ' + connection.threadId);
// });

// module.exports = connection;
module.exports = pool; 