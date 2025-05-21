// require('dotenv').config(); // Load environment variables
// const { MongoClient } = require('mongodb');

// const uri = process.env.MONGO_URI; // Use the environment variable
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// async function connectDB() {
//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');
//         return client.db('taskManager'); // Replace 'taskManager' with your database name
//     } catch (error) {
//         console.error('Failed to connect to MongoDB:', error);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;
