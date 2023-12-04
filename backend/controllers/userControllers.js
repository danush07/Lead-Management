const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')

//reg user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email,location,phone,empId, password } = req.body

 
  if (!name || !email || !empId || !password || !location ||!phone) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const userExists1 = await User.findOne({empId})
  if(userExists1){
    res.status(400)
    throw new Error('User with Same Employee ID Already Exists')
  }
  const userExists2 = await User.findOne({phone})
  if(userExists2){
    res.status(400)
    throw new Error('User with Same Phone Number Already Exists')
  }


  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    empId,
    email,
    location,
    phone,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name:user.name,
      location:user.location,
      phone:user.location,
      empId: user.empId,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { empId, email, password } = req.body;
  const existingUser = await User.findOne({ $and: [{ email }, { empId }] });
  // const existEmail = await User.findOne({email})
  if(!email){
    res.status(401);
    throw new Error('Please Enter the Email');
  }
  if(!password){
    res.status(401);
    throw new Error('Please enter the password');
  }
  if(!empId){
    res.status(401);
    throw new Error('Please enter the empId');
  }
  if (email !== existingUser.email) {
    res.status(401);
    throw new Error('Invalid Email Id');
  }
  if (empId !== existingUser.empId) {
    res.status(401);
    throw new Error('Invalid employee ID');
  }
  if (!existingUser) {
    res.status(401);
    throw new Error('Email and Employee Id Does not Match');
  }


  if (await bcrypt.compare(password, existingUser.password)) {
    res.status(200).json({
      _id: existingUser._id,
      name:existingUser.name.toLowerCase(),
      empId: existingUser.empId,
      email: existingUser.email.toLowerCase(),
      token: generateToken(existingUser._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid password');
  }
});


//get current user
const profilePage = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name:req.user.name,
    email: req.user.email,
    empId: req.user.empId,
    location:req.user.location,
    phone: req.user.phone
  }
  res.status(200).json(user)
})



const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); 
  // console.log(users)

  res.status(200).json(users);
});


const JWT_SECRET = 'danush'

// Generate token
const generateToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  profilePage,
}

//qj5UjTFBMhuhToAn
//danush07