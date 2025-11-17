import { CurrencyCodes } from "validator/lib/isISO4217.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend

const placeOrder = async (req, res)=> {
    // URL of frontend
    const frontend_URL = "https://food-del-frontend-c1xl.onrender.com";

    try{
        const totalAmount = Number(req.body.amount); // ensure it's a number
        // 🛑 Minimum order validation (block if < 50)
        if (totalAmount < 50) {
        return res.status(400).json({
            success: false,
            message: "Minimum order amount should be ₹50 or more.",
        });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: req.body.paymentMethod,
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(req.body.userId,{cartData: {}});

        const line_items = req.body.items.map((item)=> {
            return {
                price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Rs → paise
                },
                quantity: item.quantity,
            }
            
        });


        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivary Charges",
                },
                unit_amount:2 * 100, // Rs → paise
                },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder.id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder.id}`,
        })
        res.json({success: true, session_url: session.url});
    } catch(error) {
        console.log(error);
        res.json({success: false, message: "error"});
    }
}



// ⭐ Cash On Delivery Order API
const placeOrderCOD = async (req, res) => {
    const totalAmount = Number(req.body.amount);
    // 🛑 Minimum order validation (block if < 50)
    if (totalAmount < 50) {
        return res.status(400).json({
            success: false,
            message: "Minimum order amount should be ₹50 or more.",
        });
    }
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: req.body.paymentMethod,
        });

        await newOrder.save();

        // clear the cart after order
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        return res.json({
            success: true,
            message: "Order placed successfully (COD)",
            orderId: newOrder._id
        });

    } catch (error) {
        console.log("COD ERROR:", error);
        res.json({
            success: false,
            message: "COD order failed"
        });
    }
};
////////////////
const verifyOrder = async(req, res) => {
    const {orderId, success} = req.query;
    try {
        if(success === "true" || success === true) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            // await orderModel.findByIdAndUpdate(orderId );
            res.json({success: true, message: "Paid"});
        }else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Not Paid"});
        }
    }catch(err) {
        console.log(err);
        res.json({success: false, message: "error"});
    }
}

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success: true,message: orders});
    }catch(error) {
        console.log("User orders error",error);
        res.json({success: false, message:"orders data not found "});
    }
}
// Listing Orders for admin panel

const listOrders = async (req, res)=> {
    try {
        const orders = await orderModel.find({});
        res.json({success: true, data: orders});
    }catch(error) {
        console.log("Not found total Order details",error);
        res.json({success: false, message: "data Not Found in Orders database"});
    }
}

// api for updating order status
const updateStatus = async (req, res)=> {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
        res.json({success: true, message: "Status Update"});
    }catch(error){
        console.log(error);
        res.json({success: false, message: "not update status error"});
    }
}



export {placeOrder,placeOrderCOD, verifyOrder, userOrders, listOrders, updateStatus}
