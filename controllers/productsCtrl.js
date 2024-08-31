import expressAsyncHandler from "express-async-handler";
import Product from "../model/Product.js";


// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProductCtrl = expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, description, category, sizes, colors, price, totalQty, brand } = req.body;

    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product Already Exists");
    }

    //create the product
    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
    });

    //send response
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
})      