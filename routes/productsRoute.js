import express from "express";
import { createProductCtrl, getProductsCtrl } from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRoutes = express.Router();

productsRoutes.post('/', isLoggedIn, createProductCtrl);
productsRoutes.get('/', getProductsCtrl);
productsRoutes.get('/', getProductsCtrl);


export default productsRoutes;

