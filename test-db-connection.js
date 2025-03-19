const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB!');
        
        // Test query to users collection
        const User = require('./backend/models/User');
        const userCount = await User.countDocuments();
        console.log('Number of users in database:', userCount);
        
        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

testConnection(); 