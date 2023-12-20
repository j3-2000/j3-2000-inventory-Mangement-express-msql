import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';
import Address from './address.js';
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
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
});

User.hasOne(Address);
Address.belongsTo(User);
User.belongsTo(Role, { foreignKey: 'roleId' });

// export async function createUserWithRole(roleId) {
//     const Role = require('./roles.js').default; 
//     User.belongsTo(Role, { foreignKey: 'roleId' });
// }

export default User;
