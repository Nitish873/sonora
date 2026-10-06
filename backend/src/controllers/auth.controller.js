const userModel = require('../models/user.model');
const twt = require("jsonwebtoken");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

async function registerUser(req,res){
  try {
    const {name , email , password , role = 'user'} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message : 'Name, email and password are required'});
    }

    const isUserExist = await userModel.findOne({

        $or : [
            {name},
            {email},
        ]
    })

    if(isUserExist){
        return res.status(400).json({message : 'User already exists'});
    }

    const hash = await bcrypt.hash(password , 10);

    const user = new userModel({
        name ,
        email,
        password : hash,
        role
    })

    await user.save();

    const token = twt.sign(
       {
        _id : user._id,
        role : user.role
       }, process.env.JWT_SECRET
    )

    res.cookie('token' , token)

    res.status(201).json({
        message : 'User registered successfully',
        user : {
            id : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        }
    })
  } catch (err) {
    if (err.code === 11000) {
        return res.status(400).json({message : 'User already exists'});
    }

    console.error('Registration failed:', err.message);
    return res.status(500).json({message : 'Registration failed'});
  }

}

async function loginUser(req,res){
  try {
    const {name , email , password} = req.body;

    

    if (!password || (!name && !email)) {
        return res.status(400).json({message : 'Name or email and password are required'});
    }

    const identity = email || name;
    const user = await userModel.findOne({
        $or : [
            {name : identity},
            {email : identity}
        ]
    })

    if(!user){
        return res.status(400).json({message : "Invalid credentials"});
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);

    if(!isPasswordValid){
        return res.status(400).json({message : "Invalid credentials"});
    }

    const token = twt.sign({
        _id : user._id,
        role : user.role
    }, process.env.JWT_SECRET);

    res.cookie('token' , token)

    res.status(200).json({
        message : 'User logged in successfully',
        user : {
            id : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        }
    })
  } catch (err) {
    console.error('Login failed:', err.message);
    return res.status(500).json({message : 'Login failed'});
  }

}

async function logoutUser(req, res) {
  res.clearCookie('token');
  res.status(200).json({ message: 'User logged out successfully' });
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('getMe failed:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
}
