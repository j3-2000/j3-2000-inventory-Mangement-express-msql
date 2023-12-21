import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';
import Product from './product.js';

const Inventory = db.define('Inventory', {
    quantity: {
        type: DataTypes.INTEGER,
    }

});

export default Inventory;
