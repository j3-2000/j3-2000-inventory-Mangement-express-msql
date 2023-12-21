import Inventory from '../models/inventory.js';
import Product from '../models/product.js';
import Category from '../models/Category.js';
import db from '../connectDB/db.js';

export const createCategory = async (req, res) => {
    try {
        const { category } = req.body;
         await db.sync()
        const userData = req.userData 
        const existingCategory = await Category.findOne({where : { name: category }});

        return existingCategory
            ? res.status(400).json({ message: "Category already exists. Please add products to this category." })
            : res.status(200).json({
                message: `${category} created. Now you can add products to this category.`,
                category: await Category.create({ name: category,createdBy: userData.user_id,}),
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        const products = await Product.findAll({ where: { categoryId: categoryId } });

        for (let product of products) {
            await Inventory.destroy({ where: { productId: product.id } });
        }

        await Product.destroy({ where: { categoryId: categoryId } });


        const deletedCategory = await Category.destroy({ where: { id: categoryId } });

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category and associated products deleted successfully' });

    } catch (error) {
        console.error("Error in deleteCategory:", error);
        res.status(400).json({ message: error.message });
    }
};
