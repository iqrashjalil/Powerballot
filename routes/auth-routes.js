import express from 'express';
import authController from '../controllers/auth-controller.js';
import jwt from '../middlewares/auth-middleware.js';


const router = express.Router();



router.route('/new').get((req, res)=>{
    res.send("Welcome")
})


router.route('/register').post( authController.register);
router.route('/login').post(authController.login);
router.route('/alluser').get(jwt.authMiddleware, authController.getAllUsers);
router.route('/profile').get(jwt.authMiddleware, authController.profile);
router.route('/profile/password').put(jwt.authMiddleware, authController.changePassword)

export default router;