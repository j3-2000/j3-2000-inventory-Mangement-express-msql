import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js'; 
import User from './model.js'; 

const Category = db.define('Category', {
    name: {
        type: DataTypes.STRING,
    },
    productCount: {
        type: DataTypes.INTEGER,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

});

Category.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator', 
});

export default Category;
