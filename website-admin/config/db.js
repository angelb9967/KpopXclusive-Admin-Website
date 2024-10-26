const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://jerseyloveu:jerseyloveu@cluster0.ptauw.mongodb.net/KpopReact", { 
            useUnifiedTopology: true 
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
