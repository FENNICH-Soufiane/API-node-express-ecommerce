import exppress from "express";
import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponsCtrl, getCouponCtrl, updateCouponCtrl } from "../controllers/couponCtrl.js";

const couponsRouter = exppress.Router();


couponsRouter.post("/", isLoggedIn, createCouponCtrl);
couponsRouter.get("/", getAllCouponsCtrl);
couponsRouter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);
couponsRouter.get("/single", getCouponCtrl);

export default couponsRouter;