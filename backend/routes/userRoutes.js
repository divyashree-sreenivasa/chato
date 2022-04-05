const mongoose = require('mongoose');
const express = require('express')
const { registerUser, authUser, getAllSearchUsers } = require('../controllers/userController')
const {protect} = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').post(registerUser).get(protect, getAllSearchUsers)
router.post('/login', authUser)

module.exports = router