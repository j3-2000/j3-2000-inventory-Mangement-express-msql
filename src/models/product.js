import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';
import Category from './Category.js';
import Inventory from './inventory.js';
import Order from './order.js';

const Product = db.define('Product', {
    name: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT, 
    }
});

Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category', 
});
Product.hasMany(Order, { foreignKey: 'productId'});
Product.hasOne(Inventory, { foreignKey: 'productId' ,as : 'inventory',sourceKey: 'id'});


export default Product;
