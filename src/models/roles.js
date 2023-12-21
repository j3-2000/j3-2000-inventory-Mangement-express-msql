import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';

const Role = db.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true,
});

export default Role;
