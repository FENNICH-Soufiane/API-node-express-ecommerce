import express from "express";
import { createProductCtrl, getProductsCtrl, getProductCtrl, updateProductCtrl } from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRoutes = express.Router();

productsRoutes.post('/', isLoggedIn, createProductCtrl);
productsRoutes.get('/', getProductsCtrl);
productsRoutes.get('/:id', getProductCtrl);
productsRoutes.put('/:id', updateProductCtrl);


export default productsRoutes;

