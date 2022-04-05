const mongoose = require('mongoose');
const express = require('express')
const {protect} = require('../middlewares/authMiddleware')
const { accessChat, 
        fetchChats, 
        createGroupChat, 
        renameGroup,
        addUserToGroup,
        removeUserFromGroup } = require('../controllers/chatControllers')

const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group/create').post(protect, createGroupChat)
router.route('/group/rename').put(protect, renameGroup)
router.route('/group/adduser').put(protect, addUserToGroup)
router.route('/group/removeuser').put(protect, removeUserFromGroup)

module.exports = router