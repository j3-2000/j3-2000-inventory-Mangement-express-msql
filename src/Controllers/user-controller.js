import Role from '../models/roles.js';
import Product from '../models/product.js';
import bcrypt from 'bcrypt';
import mail from '../helper/mailSender.js';
import { signToken } from '../middlewares/token.js';
import Inventory from '../models/inventory.js';
import Order from '../models/order.js';
import Category from '../models/Category.js';
import db from '../connectDB/db.js';
import User from '../models/model.js';

export const signup = async (req, res) => {
    try {
        await db.sync();
        const saltRounds = 5;
        const userData = req.body;
        const existingUser = await User.findOne({ where: { email: userData.email } });

        const saveData = async (id) => {
            const hash = await bcrypt.hash(userData.password, saltRounds);

            const user = await User.create({
                name: userData.name,
                email: userData.email,
                address: userData.address,
                phone: parseInt(userData.phone),
                password: hash,
                roleId: id
            });

            res.status(200).json({ message: `Welcome, ${user.name}!`, details: user });
        };

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });

        } else {
            await db.sync();
            await Role.sync();
            await User.sync();
            const userRole = await Role.findOne({ where: { name: "user" } }) || await Role.create({ name: "user" });
            const adminRole = await Role.findOne({ where: { name: "admin" } }) || await Role.create({ name: "admin" });

            if (!userRole.id) {
                await userRole.save();
            }
            if (!adminRole.id) {
                await adminRole.save();
            }
            userData.role == "admin" ? saveData(adminRole.id) : saveData(userRole.id)
        }
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const login_data = req.body;
        const data = await User.findOne({ where: { email: login_data.email } });
        if (!data) {
            res.status(400).json({ message: 'User not exist' });
        } else {
            const passwordsMatch = await bcrypt.compare(login_data.password, data.password);

            if (!passwordsMatch) {
                res.status(400).json({ message: 'Incorrect password' });
            } else {
                const generatedToken = signToken({ data: { user_id: data.id, user_email: login_data.email.toLowerCase() } });
                res.cookie('token', generatedToken, { httpOnly: true });
                res.status(200).json({ message: `Welcome back ${data.name}`, loggedInUser: { name: data.name, email: data.email }, token: [generatedToken] });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updated_data = req.body;
        const userData = req.userData;
        const user_email = userData.user_email;


        const existingUser = await User.findOne({ where: { email: user_email.toLowerCase() } });

        if (existingUser) {

            await User.update(updated_data, {
                where: { email: user_email.toLowerCase() },
                returning: true,
            });


            await Address.update(updated_data.address, {
                where: { userId: existingUser.id },
                returning: true,
            });

            res.status(200).json({ message: 'Profile updated successfully', user: updated_data });
        }
        else {
            res.status(200).json({ message: 'Profile not found' });
        }

    } catch (error) {
        console.error('Error processing the PUT request:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const forgotPassword = async function (req, res) {
    try {
        const forgot_email = req.body;
        const data = await User.findOne({
            where: {
                email: forgot_email.email.toLowerCase(),
            }
        });

        if (data) {

            const generatedToken = signToken({ data: { user_email: forgot_email.email.toLowerCase() } });
            mail(forgot_email.email.toLowerCase(), generatedToken);
            res.status(200).json({ message: "link to change password is send :expires in 2 min", token: generatedToken });
        } else {
            res.status(400).json({ message: "email not exist in database" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const userData = req.userData
        const reset_mail = userData.user_email;
        const entered_password = req.body
        const hash = await bcrypt.hash(entered_password.password, 5);
        const existingUser = await User.findOne({ where: { email: reset_mail } });

        if (existingUser) {
            existingUser.password = hash;
            await existingUser.save()
            res.status(200).json({ message: ` Your password has been updated` });
        }
        else {
            res.status(404).json({ message: 'user not found' })
        }
    } catch (error) {
        console.error('Error processing the PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const displayProducts = async (req, res) => {
    try {


        const products = await Product.findAll({
            include: [
                {
                    model: Inventory,
                    as: 'inventory'
                },
            ],
        });

        const allProducts = products.map(product => ({
            name: product.name,
            price: product.price,
            quantity: product.inventory.quantity,
        }));

        res.status(200).json(allProducts);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const displayCategoryProducts = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const categoryProducts = await Product.findAll({
            where: {
                categoryId: categoryId,
            },
            include: [
                {
                    model: Inventory,
                    as: 'inventory',
                    attributes: ['quantity'],
                },
            ],
        });

        if (categoryProducts.length === 0) {
            return res.status(404).json({ message: 'No products found in the specified category.' });
        }

        const allProducts = categoryProducts.map(product => {
            const productDetails = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.inventory ? product.inventory.quantity : 0,
            };
            return productDetails;
        });

        res.status(200).json(allProducts);
    } catch (error) {
        console.error("Error in displayCategoryProducts:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// export const orderProducts = async (req, res) => {
//     try {
//         const { productId, quantity } = req.body;
//         const userData = req.userData;
//         await Order.sync()
//         const inventory = await Product.findOne({
//             where: { id: productId }, include: [
//                 {
//                     model: Inventory,
//                     as: 'inventory',
//                     attributes: ['quantity'],
//                 },
//             ],
//         });
//         if (!inventory) {
//             return res.status(404).json({ error: 'Inventory not found for the specified product.' });
//         }

//         if (inventory.inventory.quantity < quantity) {
//             return res.status(400).json({ error: 'Insufficient quantity in the inventory.' });
//         }

//         inventory.inventory.quantity -= quantity;
//         await inventory.save();

//         const existingOrder = await Order.findOne({
//             where: {
//                 userId: userData.user_id,
//                 productId: productId,
//             },
//         });

//         if (existingOrder) {
//             existingOrder.quantity += quantity;
//             existingOrder.cartPrice += inventory.price * quantity;
//             await existingOrder.save();
//             res.status(200).json({ message: 'Order updated successfully.', details: existingOrder });
//         } else {
//             const orderDetails = await Order.create({
//                 quantity: quantity,
//                 cartPrice: inventory.price * quantity,
//             });

//             res.status(200).json({ message: 'Product Ordered successfully', details: orderDetails, });
//         }


//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

export const orderProducts = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userData = req.userData;

        // Make sure to import the necessary models (Product, Inventory, Order)
        await Order.sync();

        const productWithInventory = await Product.findOne({
            where: { id: productId },
            include: [
                {
                    model: Inventory,
                    as: 'inventory',
                    attributes: ['quantity','id'],
                },
            ],
        });

        if (!productWithInventory) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        const inventory = productWithInventory.inventory;

        if (inventory.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity in the inventory.' });
        }


        inventory.quantity -= quantity;
        await productWithInventory.inventory.save();

        const existingOrder = await Order.findOne({
            where: {
                userId: userData.user_id,
                productId: productId,
            },
        });

        if (existingOrder) {
            existingOrder.quantity += quantity;
            existingOrder.cartPrice += productWithInventory.price * quantity;
            await existingOrder.save();
            res.status(200).json({ message: 'Order updated successfully.', details: existingOrder });
        } else {
            const orderDetails = await Order.create({
                userId: userData.user_id,
                productId: productId,
                quantity: quantity,
                cartPrice: productWithInventory.price * quantity,
            });

            res.status(200).json({ message: 'Product ordered successfully', details: orderDetails });
        }
    } catch (error) {
        console.error("Error in orderProducts:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
