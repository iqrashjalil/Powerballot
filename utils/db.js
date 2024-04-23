import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: ".env"})


const uri = process.env.MONGO_DB_URI;

const connectDB = async () => {
    try{
        await mongoose.connect(uri);
        console.log("Connected to Database");

    }catch{
        console.log("Database Connection Failed");
        console.log(uri)
        process.exit(0);
    }
}


export default connectDB;