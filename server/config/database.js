'use strict';

const mongoose = require('mongoose');

const uri = 'your_mongodb_connection_string'; // Replace with your connection string

const connectMongoDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectMongoDB;
