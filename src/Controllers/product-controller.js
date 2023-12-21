import Inventory from '../models/inventory.js';
import Product from '../models/product.js';
import Category from '../models/Category.js';

export const addProduct = async (req, res) => {
    try {
        const { name, price, categoryId, quantity } = req.body;
        await Product.sync();
        await Inventory.sync();
        const addProductManually = async (id) => {
            let existingProduct = await Product.findOne({ where: { name: name } })

            if (!existingProduct) {
                const newProduct = Product.create({
                    name,
                    price,
                    categoryId: id,
                });
                const savedProduct = await newProduct;
                const newInventory = Inventory.create({
                    productId: savedProduct.id,
                    quantity: parseInt(quantity, 10),
                });

                res.status(201).json({ "product details": savedProduct, });
            } else {
                res.status(500).json({ "product details": "product already exists" });
            }
        }

        let existingCategory = await Category.findOne({ where: { id: categoryId } })

        !existingCategory ? res.status(404).json({ "msg": 'category not exist!! please add first' }) : addProductManually(existingCategory.id)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        // await Inventory.findOneAndDelete({ productId: productId });
        await Inventory.destroy({ where: { productId: productId }, });

        const deletedProduct = await Product.destroy({ where: { id: productId }, });
        let name = deletedProduct.name
        deletedProduct ? res.status(200).json({
            "msg": `Product Named {${name}} is deleted with associated inventory`
        }) : res.status(404).json({ "msg": `following id (${productId}) is not found` })

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
