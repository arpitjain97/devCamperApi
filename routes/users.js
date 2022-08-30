const express = require('express');
const router = express.Router();
const { getUsers, getUser,createUser, updateUser,deleteUser} = require('../controllers/users');
const User = require('../models/User');
const {protect,authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advanceResults');

router.use(protect);
router.use(authorize('admin'));
router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/:id').get(getUser).post(deleteUser).put(updateUser);

module.exports = router;