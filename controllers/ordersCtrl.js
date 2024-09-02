import expressAsyncHandler from "express-async-handler"






//@desc create orders
//@route POST /api/v1/orders
//@access private
export const createOrderCtrl = expressAsyncHandler(async (req, res) => {
    res.json({
        msg: "Order Ctrl"
    })
})