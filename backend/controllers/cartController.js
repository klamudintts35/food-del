import userModel from "../models/userModel.js";

// add item to user cart
const addToCart = async(req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cardData = await userData.cardData;
        if(!cardData[req.body.itemId]) {
            cardData[req.body.itemId] = 1;
            // console.log(cartData);
 
        }else {
            cardData[req.body.itemId] += 1;
        }
        const sav = await userModel.findByIdAndUpdate(req.body.userId, {cardData});
        // console.log(sav);
        res.json({success: true, message: "Added To Cart"});
    }catch(error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
    
    
}




// remove item to user cart 
const removeToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cardData = await userData.cardData;
        if(cardData[req.body.itemId] > 0) {
            cardData[req.body.itemId] -= 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cardData});
        res.json({success: true, message: "Remove From Cart"});
    }catch(error) {
        console.log(error);
        res.json({success: false, message: "errro"});
    }
    
}

/// fetch user Card data
 
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cardData;
        res.json({success: true, cartData});
    }catch(error) {
        console.log(error);
        res.json({success: false, message: "error"})
    }
    


}

export {addToCart, removeToCart, getCart};