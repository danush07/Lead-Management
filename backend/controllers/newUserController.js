const asyncHandler = require('express-async-handler')
const NewUser = require('../Models/newUserModel')
// const User = require('../Models/userModel')

const createUser = asyncHandler(async (req, res) => {
    const { bname, name, email, type, phone, products, source } = req.body;
    
    const userNumberEx = await NewUser.findOne({ phone });
    
    if (userNumberEx) {
      res.status(400)
      throw new Error('User with same Phone Number already exists')
    }
    const userExists = await NewUser.findOne({ email });
    if (userExists) {
      res.status(400) 
      throw new Error('User with same email id already exists')
    }
  
  
    if (!bname || !name || !email || !type || !products || !source || !phone) {
      res.status(400)
      throw new Error('Please include all the fields')
    }
  
    const newuser = await NewUser.create({
      bname,
      name,
      type,
      email,
      products,
      source,
      phone,
    });
  
    if (newuser) {
      res.status(201).json({
        _id: newuser._id,
        bname:newuser.bname,
        name: newuser.name,
        phone: newuser.phone,
        email: newuser.email,
        products: newuser.products,
        source: newuser.source,
        type: newuser.type,
      });
    } else {
      res.status(400)
      throw new Error('Invalid Data')
    }
  });
  
const getAllNewUsers = asyncHandler(async (req, res) => {
    const users = await NewUser.find({}); 
    // console.log(users)
  // 
    res.status(200).json(users);
  });

const deleteSingleUser = asyncHandler(async(req,res)=>{
const userId = req.params.id

const user = await NewUser.findOne({_id:userId})
if(!user){
throw new Error('User Not Found')
}
await NewUser.deleteOne({ _id: userId});
  res.status(200).json({ message: 'User deleted successfully'})
})


const updateSingleUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const {bname, name, email, type, phone, products, source } = req.body;

  const user = await NewUser.findById(userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const userNumberExist = await NewUser.findOne({ phone });
  if (userNumberExist && userNumberExist.id !== userId) {
    res.status(400);
    throw new Error('User with same Phone Number already exists');
  }
  const userExists = await NewUser.findOne({ email });
  if (userExists && userExists.id !== userId) {
    res.status(400);
    throw new Error('User with same email id already exists');
  }
  if(bname){
    user.bname = bname;
  }
  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }
  if (type) {
    user.type = type;
  }
  if (phone) {
    user.phone = phone;
  }
  if (products) {
    user.products = products;
  }
  if (source) {
    user.source = source;
  }

  await user.save();

  res.status(200).json({ message: 'User data updated successfully', user });
});




module.exports = {
   createUser,
   getAllNewUsers,
   deleteSingleUser,
   updateSingleUser
   
  }