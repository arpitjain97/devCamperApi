const express = require('express');
const { 
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
    } = require('../controllers/courses');
const {protect} = require('../middleware/auth');
const router = express.Router({mergeParams:true});
const Course = require('../models/Course');
const advanceResults = require('../middleware/advanceResults');


router.route('/')
    .get(advanceResults(Course,{path:'bootcamp', select: 'name description'}),getCourses)
    .post(protect,addCourse);
router.route('/:id')
    .get(getCourse)
    .put(protect,updateCourse)
    .delete(protect,deleteCourse);

module.exports = router;