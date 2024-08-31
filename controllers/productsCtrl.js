import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";


// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
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
});

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProductsCtrl = asyncHandler(async (req, res) => {

    let productQuery = Product.find();



    //search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: "i" },
        });
    }

    //filter by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: "i" },
        });
    }

    //filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: "i" },
        });
    }

    //filter by color
    if (req.query.color) {
        productQuery = productQuery.find({
            colors: { $regex: req.query.color, $options: "i" },
        });
    }

    //filter by size
    if (req.query.size) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.size, $options: "i" },
        });
    }

    const products = await productQuery;

    res.json({
        status: "success",
        products
    })
})