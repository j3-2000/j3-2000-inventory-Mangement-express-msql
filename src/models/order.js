// import { DataTypes } from 'sequelize';
// import db from '../connectDB/db.js';
// import User from './model.js';
// import Product from './product.js';

// const Order = db.define('Order', {
//     quantity: {
//         type: DataTypes.INTEGER,
//     },
//     cartPrice: {
//         type: DataTypes.FLOAT, // or whatever data type is suitable for your use case
//     },
//     productId: { type: DataTypes.INTEGER },
//     userId: { type: DataTypes.INTEGER },
// });

// Order.belongsTo(Product, { foreignKey: 'productId' });
// Order.belongsTo(User, { foreignKey: 'userId' });

// export default Order;


import { DataTypes } from 'sequelize';
import db from '../connectDB/db.js';
import User from './model.js';

const Order = db.define('Order', {
    quantity: {
        type: DataTypes.INTEGER,
    },
    cartPrice: {
        type: DataTypes.FLOAT,
    }
});

Order.belongsTo(User, { foreignKey: 'userId' });

export default Order;

