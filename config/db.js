const mongoose = require('mongoose');

const connectDB = async () =>{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewURLParser:true,
        useUnifiedtopology:true
    });
    console.log(`MongoDb connected ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;