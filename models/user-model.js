import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    idCardNumber: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
    isVoted: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,

    },
    constituency: {
        type: String
    }
   
})



userSchema.pre('save', async function (next) {
    const user = this;

    if(!user.isModified){
        return next();
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }

});


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


const User = model('User', userSchema);

export default User;