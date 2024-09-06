import exppress from "express";
import { createOrderCtrl, getAllordersCtrl, getOrderStatsCtrl, getSingleOrderCtrl, updateOrderCtrl } from "../controllers/ordersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRouter = exppress.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);

export default orderRouter;
