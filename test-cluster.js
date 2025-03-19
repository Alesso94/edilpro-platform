const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function testClusterConnection() {
    try {
        console.log('Testing MongoDB cluster connection...');
        console.log('Cluster URI:', process.env.MONGODB_URI);
        
        // Imposta un timeout più lungo per il test
        const options = {
            serverSelectionTimeoutMS: 30000, // 30 secondi
            socketTimeoutMS: 30000,
            connectTimeoutMS: 30000
        };
        
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('Successfully connected to MongoDB cluster!');
        
        // Verifica lo stato della connessione
        const state = mongoose.connection.readyState;
        console.log('Connection state:', state);
        
        // Lista i database disponibili
        const dbs = await mongoose.connection.db.admin().listDatabases();
        console.log('Available databases:', dbs.databases.map(db => db.name));
        
        // Verifica le collezioni nel database
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in database:', collections.map(c => c.name));
        
        // Chiudi la connessione
        await mongoose.connection.close();
        console.log('Connection closed successfully');
    } catch (error) {
        console.error('MongoDB cluster connection error:', error);
        if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to any server in the MongoDB cluster.');
            console.error('Please check:');
            console.error('1. Network connectivity');
            console.error('2. IP whitelist in MongoDB Atlas');
            console.error('3. Database user credentials');
        }
    }
}

testClusterConnection(); 