import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';
import Category from './Category.js';

const Product = db.define('Product', {
    name: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT, 
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
    },
});

Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category', 
});

export default Product;
