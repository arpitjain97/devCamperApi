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
const {protect,authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advanceResults');

const router = express.Router();
const courseRouter = require('./courses');
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect,authorize('publisher','admin'),bootcampPhotoUpload);
router.route('/')
    .get( advancedResults(Bootcamp,'courses'), getBootcamps)
    .post(protect,authorize('publisher','admin'),createBootcamps);

router.route('/:id')
    .get(getBootcamp)
    .put(protect,authorize('publisher','admin'),updateBootcamps)
    .delete(protect,authorize('publisher','admin'),deleteBootcamps);

module.exports = router;