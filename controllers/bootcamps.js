const Bootcamp = require('../models/Bootcamp');
const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

exports.getBootcamps = asyncHandler(async (req,res,next) =>{

        res.status(200).json(res.advancedResults);
});
exports.getBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id);
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

exports.bootcampPhotoUpload = asyncHandler(async(req,res,next) =>{
    
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        if(!req.files){
            return next(new ErrorResponse(`Please upload a file`,400));
        }
        const file = req.files.file;

        if(!file.mimetype.startsWith('image')){
            return next(new ErrorResponse(`Please upload an Image file`,400));
        }
        if(file.size> process.env.MAX_FILE_UPLOAD){
            return next(new ErrorResponse(`Please upload an Image less than ${process.env.MAX_FILE_UPLOAD}`,400));
        }
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
        
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
            if(err){
                console.error(err)
                return next(new ErrorResponse(`Problem with file upload`,500));
            }
            await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name});
            res.status(200).json({
                success:true,
                data:file.name
            });
        })
});