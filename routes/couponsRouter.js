import exppress from "express";
import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCouponCtrl } from "../controllers/couponCtrl.js";

const couponsRouter = exppress.Router();


couponsRouter.post("/", isLoggedIn, createCouponCtrl);


export default couponsRouter;