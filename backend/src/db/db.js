const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connectDB(){

    try{
        const mongoUrl = process.env.MONGO_URL?.trim();

        if (!mongoUrl) {
            throw new Error('MONGO_URL is missing from the environment');
        }

        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("Database connected successfully");
    }
    catch(err){
        console.error("Database connection failed:", err.message);
    }
}

module.exports = connectDB;
