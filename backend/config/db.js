import mongoose from "mongoose";
export const connectDB = async ()=> {
    await mongoose.connect('mongodb+srv://klamudinm35_db_user:Klamudindb786@cluster0.rlza1is.mongodb.net/food-del').then(()=> { console.log("DB connected")})
}
