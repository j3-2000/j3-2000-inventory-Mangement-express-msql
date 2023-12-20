import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';
import Product from './product.js';

const Inventory = db.define('Inventory', {
    quantity: {
        type: DataTypes.INTEGER,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
    },

});

Inventory.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
});

export default Inventory;
