import exppress from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { deleteBrandCtrl, updateBrandCtrl, getSingleBrandCtrl, getAllBrandsCtrl, createBrandCtrl } from "../controllers/brandsCtrl.js";

const brandsRouter = exppress.Router();

brandsRouter.post("/", isLoggedIn, createBrandCtrl);
brandsRouter.get("/", getAllBrandsCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.delete("/:id", deleteBrandCtrl);
brandsRouter.put("/:id", updateBrandCtrl);

export default brandsRouter;