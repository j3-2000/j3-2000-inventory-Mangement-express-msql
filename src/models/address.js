// address.js
import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';

const Address = db.define('Address', {
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true,
});

export default Address;
