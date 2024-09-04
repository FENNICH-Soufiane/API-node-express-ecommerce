import expressAsyncHandler from "express-async-handler"
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import User from "../model/User.js";
import Order from "../model/Order.js";
import Product from "../model/Product.js";

// Stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

//@desc create orders
//@route POST /api/v1/orders
//@access private
export const createOrderCtrl = expressAsyncHandler(async (req, res) => {

    const { orderItems, shippingAddress, totalPrice } = req.body;
    console.log(req.body);
    //Find the user
    const user = await User.findById(req.userAuthId);
    //Check if user has shipping address
    if (!user?.hasShippingAddress) {
        throw new Error("Please provide shipping address");
    }
    //Check if order is not empty
    if (orderItems?.length <= 0) {
        throw new Error("No Order Items");
    }

    //Place/create order - save into DB
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
        totalPrice,
    });

    //Update the product qty
    // const products = await Product.find({ _id: { $in: orderItems } });

    const productIds = orderItems.map(item => item.id); // Extraire uniquement les IDs des produits

    const products = await Product.find({ _id: { $in: productIds } });

    orderItems?.map(async (orderItem) => {
        const product = products?.find((product) => {
            return product?._id?.toString() === orderItem.id; // Comparer les IDs
        });
        if (product) {
            product.totalSold += orderItem.qty;
        }
        await product.save();
    });
    //push order into user
    user.orders.push(order?._id);
    await user.save();

    //make payment (stripe)
    //convert order items to have same structure that stripe need
    const convertedOrders = orderItems.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item?.name,
                    description: item?.description,
                },
                unit_amount: item?.price * 100,
            },
            quantity: item?.qty,
        };
    });
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });
    res.send({ url: session.url });
});


//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = expressAsyncHandler(async (req, res) => {
    //find all orders
    const orders = await Order.find().populate("user");
    res.json({
      success: true,
      message: "All orders",
      orders,
    });
  });