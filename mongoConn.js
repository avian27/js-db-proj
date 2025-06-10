const mongoose = require('mongoose');

async function connectToMongoDB(connectionString) {
    console.log(connectionString);
    try {
        // Connect to the MongoDB server
        await mongoose.connect(connectionString);
        console.log('Connected successfully to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
async function closeMongoDBConn() {
    await mongoose.connection.close();
    console.log('Connection closed');
}

module.exports = {
    connectToMongoDB, closeMongoDBConn
};