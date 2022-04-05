const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, profileImage } = req.body;

    if(!name || !email || !password) {

        res.status(400)
        const obj = {
            name: name, 
            email: email,
            password: password
        }
        throw new Error(`Please enter all the fields ${obj}`)
    }

    const userExists = await User.findOne({email}) 

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name, 
        email,
        password,
        profileImage
    })

    if(user) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Failed to create user')
    }

})

const authUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})
    
    if (user && await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            token: generateToken(user._id)
        })
    }
})

// /api/user?search=divya
const getAllSearchUsers = asyncHandler(async (req, res) => {
    const userSearch = req.query.search ? {
        $or : [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    }: {}

    const users = await User.find(userSearch).find({_id: {$ne: req.user._id}})
    res.send(users)
})

module.exports = {
    registerUser,
    authUser,
    getAllSearchUsers
}