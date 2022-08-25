const express = require('express');
const { getBootcamp, 
        getBootcamps,
        createBootcamps,
        updateBootcamps,
        deleteBootcamps,
        getBootcampsInRadius,
        bootcampPhotoUpload
    } = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advanceResults');

const router = express.Router();
const courseRouter = require('./courses');
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);
router.route('/')
    .get( advancedResults(Bootcamp,'courses'), getBootcamps)
    .post(createBootcamps);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamps)
    .delete(deleteBootcamps);

module.exports = router;