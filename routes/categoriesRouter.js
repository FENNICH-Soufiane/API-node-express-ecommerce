import exppress from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { createCategoryCtrl } from "../controllers/categoriesCtrl";

const categoriesRouter = exppress.Router();

categoriesRouter.post("/", isLoggedIn, createCategoryCtrl);

export default categoriesRouter;