import jwt from "jsonwebtoken"

export const sendCookie = (res,user,message,statusCode=200)=> {
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY);
    
    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        maxAge: 7*60*60*24,
    }).json({
        success: true,
        message,
        
    })
}