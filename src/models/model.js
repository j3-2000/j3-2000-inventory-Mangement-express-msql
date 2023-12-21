import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';
import Role from './roles.js';

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },address: {
        type: DataTypes.JSON,
      },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
});

User.belongsTo(Role, { foreignKey: 'roleId' });

export default User;
