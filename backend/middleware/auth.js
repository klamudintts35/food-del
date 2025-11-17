import jwt from "jsonwebtoken";


const authMiddleware = async(req, res, next)=> {
    const {token} = req.headers;
    if(!token) {
        return res.json({success: false, message: "Not authorized Login Again"});
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        // ✅ Fix: ensure req.body exists before using it
        if (!req.body) req.body = {};
        req.body.userId = token_decode.id;
        next();
    } catch(error) {
        console.log("not decode",error);
        res.json({success: false, message: "Error not found id"});
    }
}

export default authMiddleware;