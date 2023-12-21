import express from 'express';
import dotenv from 'dotenv';
import db from './src/connectDB/db.js';
import userRoutes from './src/routes/user-routes.js';
import adminRoutes from './src/routes/admin-routes.js';
import categoryRoutes from './src/routes/category-routes.js';
import productRoutes from './src/routes/product-routes.js';

import User from './src/models/model.js';

dotenv.config();
const port = process.env.PORT;
const app = express();

app.set('view engine', 'pug');
app.set('views', './src/view');
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);

(async () => {
    try {
        await db.authenticate();
        console.log('Database connection has been established successfully.');

        await User.sync();
        console.log('Model synchronized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
})();

app.listen(port, () => {
    console.log(`Server running at port number ${port}`);
});
