var mongoose = require('mongoose');

const newuserSchema = mongoose.Schema(
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
  
    },
    type: {
        type: String,
        required: [true, 'Please select the UserType'],
        enum: ['Lead', 'Prospect', 'Client','On Hold'],
    },
    phone:{
      type:String,
      required: [true, 'Please add a Phone Number'],
     
    },
    products: {
        type: String,
        required: [true, 'Please Select the Product'],
        enum:['Taxbandits','Taxbandits API','Tax 990','Express Extension','Express 1099']
        },
    source:{
        type: String,
        required:[true,'Please Select the Source'],
        enum:['Website',
            'Direct',
            'Advertisement',
            'Social Media',
            'Others']
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('NewUser', newuserSchema)