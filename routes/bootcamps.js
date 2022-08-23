const express = require('express');
const { getBootcamp, 
        getBootcamps,
        createBootcamps,
        updateBootcamps,
        deleteBootcamps,
        getBootcampsInRadius,
        bootcampPhotoUpload
    } = require('../controllers/bootcamps');
const router = express.Router();
const courseRouter = require('./courses');
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);
router.route('/')
    .get(getBootcamps)
    .post(createBootcamps);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamps)
    .delete(deleteBootcamps);

module.exports = router;