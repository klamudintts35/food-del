 import express from "express";
 import cors from "cors";
 import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodroute.js";
import userRouter from "./routes/userroute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartroute.js";
import orderRouter from "./routes/orderrouter.js";

 // app config
 const app = express();
 const port = process.env.PORT || 4000;

 // middleware 
 app.use(express.json());
 app.use(cors());


// db connection 
 connectDB();

 // api endpoints 
 app.use("/api/food", foodRouter)
 app.use("/images", express.static("uploads"));
 app.use("/api/user", userRouter);
 app.use("/api/cart", cartRouter);
 app.use("/api/order",orderRouter);


 // route
 app.get("/", (req, res)=> {
     res.send("API WORKING");
 });

 app.listen(port , ()=> {
    console.log(`server started on http://localhost:${port}`);
 })

 ///mongodb+srv://klamudinm35_db_user:Klamuddindb@786@cluster0.pgfymrd.mongodb.net/?
