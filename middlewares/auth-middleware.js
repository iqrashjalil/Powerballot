import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../utils/error-handler.js';


const authMiddleware =(req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization){
        return next(new ErrorHandler("Token Not Found", 401))
    }
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return next(new ErrorHandler("Invalid Token", 401))
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        req.user = decoded;
        next();
    } catch (error) {
        
        return next(new ErrorHandler("Invalid Token", 401))
    }
}


const generateToken =  ( userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})
}


export default {authMiddleware, generateToken};