import asyncHandler from "express-async-handler"
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import User from "../model/User.js";
import Order from "../model/Order.js";
import Product from "../model/Product.js";


// Stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
   const { orderItems, shippingAddress, totalPrice } = req.body;

   // Trouver l'utilisateur
   const user = await User.findById(req.userAuthId);
   // Vérifier si l'utilisateur a une adresse de livraison
   if (!user?.hasShippingAddress) {
      throw new Error("Veuillez fournir une adresse de livraison");
   }
   // Vérifier si la commande n'est pas vide
   if (orderItems?.length <= 0) {
      throw new Error("Pas d'articles dans la commande");
   }

   // Créer la commande et la sauvegarder dans la base de données
   const order = await Order.create({
      user: user?._id,
      orderItems,
      shippingAddress,
      totalPrice,
   });

   // Récupérer les IDs des produits commandés
   const productIds = orderItems.map(item => item.id);
   const products = await Product.find({ _id: { $in: productIds } });

   // Mettre à jour la quantité vendue et la quantité en stock pour chaque produit
   await Promise.all(
      orderItems.map(async (orderItem) => {
         const product = products.find(product => product?._id?.toString() === orderItem.id);
         if (!product) {
            console.error(`Produit avec ID ${orderItem.id} non trouvé`);
         } else {
            console.log(`Mise à jour du produit : ${product._id}`);
            product.totalSold += orderItem.qty;
            
            // Réduire la quantité en stock
            product.countInStock -= orderItem.qty;
            
            // Vérifier si la quantité en stock devient négative
            if (product.countInStock < 0) {
               throw new Error(`Le stock du produit ${product.name} est insuffisant`);
            }
            
            await product.save();
         }
      })
   );

   // Ajouter la commande à l'utilisateur
   user.orders.push(order?._id);
   await user.save();

   // Effectuer le paiement avec Stripe
   const convertedOrders = orderItems.map((item) => {
      return {
         price_data: {
            currency: "usd",
            product_data: {
               name: item?.name,
               description: item?.description,
            },
            unit_amount: item?.price * 100,
         },
         quantity: item?.qty,
      };
   });
   const session = await stripe.checkout.sessions.create({
      line_items: convertedOrders,
      metadata: {
         orderId: JSON.stringify(order?._id),
      },
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
   });

   res.send({ url: session.url });
});


//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
   //find all orders
   const orders = await Order.find().populate("user");
   res.json({
      success: true,
      message: "All orders",
      orders,
   });
});


//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
   //get the id from params
   const id = req.params.id;
   const order = await Order.findById(id);
   //send response
   res.status(200).json({
      success: true,
      message: "Single order",
      order,
   });
});


//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
   //get the id from params
   const id = req.params.id;
   //update
   const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
         status: req.body.status,
      },
      {
         new: true,
      }
   );
   res.status(200).json({
      success: true,
      message: "Order updated",
      updatedOrder,
   });
});


//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
   //get order stats
   const orders = await Order.aggregate([
      {
         $group: {
            _id: null,
            minimumSale: {
               $min: "$totalPrice",
            },
            totalSales: {
               $sum: "$totalPrice",
            },
            maxSale: {
               $max: "$totalPrice",
            },
            avgSale: {
               $avg: "$totalPrice",
            },
         },
      },
   ]);

   //get the date
   const date = new Date();
   const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
   const saleToday = await Order.aggregate([
      {
         $match: {
            createdAt: {
               $gte: today,
            },
         },
      },
      {
         $group: {
            _id: null,
            totalSales: {
               $sum: "$totalPrice",
            },
         },
      },
   ]);

   //send response
   res.status(200).json({
      success: true,
      message: "Sum of orders",
      orders,
      saleToday,
   });
});