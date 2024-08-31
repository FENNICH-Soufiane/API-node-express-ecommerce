import express from "express";
import { createProductCtrl, getProductsCtrl, getProductCtrl } from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRoutes = express.Router();

productsRoutes.post('/', isLoggedIn, createProductCtrl);
productsRoutes.get('/', getProductsCtrl);
productsRoutes.get('/:id', getProductCtrl);


export default productsRoutes;

