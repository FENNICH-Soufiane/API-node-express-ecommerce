import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import {globalErrhandler, notFound} from "../middlewares/globalErrHandler.js"
import productsRoutes from "../routes/productsRoute.js";

dbConnect();

const app = express();
app.use(express.json());

app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRoutes);
app.use("/api/v1/categories/", productsRoutes);

app.use(notFound);
app.use(globalErrhandler);

export default app;