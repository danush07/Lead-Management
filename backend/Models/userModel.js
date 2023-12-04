const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    bname:{
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    empId:{
        type: String,
        required: [true,'Please include empID'],
        unique: true,
    },
    phone:{
      type:Number,
      required:[true,'Please add a Phone Number']
    },
    location:{
      type:String,
      required:[true,'Please Select a Location'],
      enum: ['Chennai', 'Coimbatore', 'Erode'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)