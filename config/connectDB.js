const mongoose = require('mongoose');

async function connectDB() {
    try {
        // Connecting to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // exit the app if db fails
    }
}

module.exports = connectDB;
