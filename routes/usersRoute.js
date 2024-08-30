import express from "express";
import { registerUserCtrl } from "../controllers/usersCtrl.js";


const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);


export default userRoutes;