import expressAsyncHandler from "express-async-handler"






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
    const products = await Product.find({ _id: { $in: orderItems } });

    orderItems?.map(async (order) => {
        const product = products?.find((product) => {
            return product?._id?.toString() === order?._id?.toString();
        });
        if (product) {
            product.totalSold += order.qty;
        }
        await product.save();
    });
    //push order into user
    user.orders.push(order?._id);
    await user.save();


    res.json({
        msg: "Order Ctrl"
    })
})