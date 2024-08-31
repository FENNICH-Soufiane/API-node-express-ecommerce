import express from "express";
import { createProductCtrl } from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRoutes = express.Router();

productsRoutes.post('/', isLoggedIn, createProductCtrl);


export default productsRoutes;

