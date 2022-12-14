const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const colors = require('colors');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
dotenv.config({path: './config/config.env'});
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users  = require('./routes/users');
const reviews = require('./routes/reviews');
connectDB();
const app = express(); 
app.use(express.json());
app.use(cookieParser());


// const logger = (req,res,next) =>{
//     console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
//     next();
// }
app.use(morgan('dev'));
app.use(fileupload());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
const limiter = rateLimit({
    windowMS: 10*60*1000,
    max: 100
});
app.use(limiter);
app.use(cors()); 
app.use(express.static(path.join(__dirname,'public')));
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews);
app.use(errorHandler);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT,console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

process.on('unhandledRejection',(err,promise) =>{
    console.log(`Error: ${err.message}`.red);
    console.log('Closing Server');
    server.close(() => process.exit(1));
});