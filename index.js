const express = require('express');
const app = express();
const bodyParser=  require('body-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
const productsRoutes = require('./routes/products');
const categoryRoutes = require('./routes/category');



app.set('view engine', 'ejs'); 
app.set('views' , './views')
// app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
// app.use(methodOverride('X-HTTP-Method'))          // Microsoft
// app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
// app.use(methodOverride('x-www-form-urlencoded'))      // IBM


app.use('/categories' , categoryRoutes);
app.use('/products' , productsRoutes);


app.get('/', async (req, res) => {
    res.send("Hemlo Node");
});

// app.get('/:id', async (req, res) => {
//     const id = req.params.id ; 
//     const pro = await getProduc(id);
//     res.send(pro);
// });

app.listen(4000, () => {
    console.log(`App is running on port 4000`);
});
