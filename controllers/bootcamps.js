const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
exports.getBootcamps = asyncHandler(async (req,res,next) =>{
        let query;
        // let reqQuery = {...req.query};

        // let removeFields = ['select','sort','page','limit'];
        // removeFields.forEach(param => delete reqQuery[param]);
       
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g ,match => `$${match}`);
        
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
        if (req.query.select){
                const fields = req.query.select.split(',').join(' ');
                query = query.select(fields);
        }
        if (req.query.sort){
                const sortBy = req.query.sort.split(',').join(' ');
                query = query.sort(sortBy);
        }else{
                query = query.sort('-createdAt');   
        }
        const page = parseInt(req.query.page,10)|| 1;
        const limit = parseInt(req.query.limit,10)|| 25;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Bootcamp.countDocuments();
        query = query.skip(startIndex).limit(limit);
        console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
        const bootcamps = await query;
        const pagination = {};
        if(endIndex<total){
                req.originalUrl = req.originalUrl.replace(/page=\d{1}/g,'');
                next_page = page+1
                pagination.next = {
                        page:page+1,
                        limit,
                        link:`${req.protocol}://${req.get('host')}${req.originalUrl}&page=${next_page}`
                }
        }
        if(startIndex>0){
                req.originalUrl = req.originalUrl.replace(/page=\d{1}/g,'');
                next_page = page-1
                pagination.prev = {
                        page:page-1,
                        limit,
                        link:`${req.protocol}://${req.get('host')}${req.originalUrl}&page=${next_page}`
                }
        }

        res.status(200).json({success:true,count:bootcamps.length,pagination,body:bootcamps});
});
exports.getBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamp});
});
exports.createBootcamps = asyncHandler(async (req,res,next) =>{
    
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({success:true,data:bootcamp});
    
    
});
exports.updateBootcamps = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators:true
        })
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamp});
    
    
});
exports.deleteBootcamps = asyncHandler(async(req,res,next) =>{
    
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        bootcamp.remove();
        res.status(200).json({success:true,data:{}});
    
});

exports.getBootcampsInRadius = asyncHandler(async(req,res,next) =>{
        const {zipcode,distance} = req.params;
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;
        const radius = distance/3963;

        const bootcamps = await Bootcamp.find({
                location:{$geoWithin: {$centerSphere: [[lng,lat],radius]}}
        });
        res.status(200).json({success:true,count:bootcamps.length,data:bootcamps});
    
});