import { catchAsyncError } from '../middlewares/catch-async-error.js';
import User from '../models/user-model.js'
import { ErrorHandler } from '../utils/error-handler.js';
import  authMiddleware from '../middlewares/auth-middleware.js'





//*****************************************

// * Register Functionality Controller Code

// ***************************************** 




const register = catchAsyncError(async(req, res, next) => {
    const {name, email, idCardNumber, age, role, phone, password, constituency} = req.body;

    const user = await User.findOne({idCardNumber});
    if(user){
        return next(new ErrorHandler("User with this ID CARD already exists", 400))
    }
    if(!name || !email || !phone || !password || !idCardNumber ){
        return next(new ErrorHandler("Please Fill All The Fields!",400))   
     }

     const isNumeric = /^\d+$/.test(idCardNumber);

    if (!isNumeric) {
        return next(new ErrorHandler("Remove Any Special Charachters/dashes", 400))
    }


     if (age < 18){
         return next(new ErrorHandler("You must be at least 18 years old", 400))
     }
     
    const userCreated = await User.create({
        name, email, phone, idCardNumber, age, role, password, constituency
    })

    const payload = {
        id: userCreated.id,
        name: userCreated.name
    }
    const token =  authMiddleware.generateToken(payload);

    res.status(201).json({message:"User Created Successfully", user:userCreated, token:token})
    

}
)




//*****************************************

// * Login Functionality Controller Code

// ***************************************** 




const login = catchAsyncError(async(req, res, next)=>{
    const {idCardNumber, password } = req.body;
    const user = await User.findOne({idCardNumber});
   
    if(!user || !(await user.comparePassword(password))){
        return next(new ErrorHandler("Invalid Id Card or Password", 400));
    }

    
    const isNumeric = /^\d+$/.test(idCardNumber);

    if (!isNumeric) {
        return next(new ErrorHandler("Remove Any Special Charachters/dashes", 400))
    }
   

   

    const payload = {
        id: user.id,
        idCardNumber: user.idCardNumber
    }
    const token =  authMiddleware.generateToken(payload);
    
    res.status(201).json({message:"Logged In Successfully", user:user,token:token, userID:user.id})
})



//*****************************************

// * Profile Functionality Controller Code

// ***************************************** 

const profile = catchAsyncError(async(req, res, next)=>{
    const userData = req.user;

    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({message:"User Data from profile Api", userData:user})
})



//*****************************************

// * Change Password Functionality Controller Code

// ***************************************** 
const changePassword = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Validate current password
    if (!(await user.comparePassword(currentPassword))) {
        return next(new ErrorHandler("Invalid Password", 400));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user object with hashed password
    user.password = hashedPassword;

    // Save the user object
    await user.save();

    res.status(200).json({ message: "Password Changed Successfully" });
});


const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json({User: users});
}

export default {register, login, profile, changePassword, getAllUsers };