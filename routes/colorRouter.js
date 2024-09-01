import exppress from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorCtrl, getAllColorsCtrl, getSingleColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/colorsCtrl.js";

const colorsRouter = exppress.Router();

colorsRouter.post("/", isLoggedIn, createColorCtrl);
colorsRouter.get("/", getAllColorsCtrl);
colorsRouter.get("/:id", getSingleColorCtrl);
colorsRouter.delete("/:id", deleteColorCtrl);
colorsRouter.put("/:id", updateColorCtrl);

export default colorsRouter;